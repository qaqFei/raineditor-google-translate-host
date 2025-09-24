class BinaryOutStream {
    constructor() {
        this._buffer = [];
    }

    writeBytes(bytes) {
        this._buffer.push(...bytes);
    }

    writeByte(byte) {
        this._buffer.push(byte);
    }

    writeInt8(int) {
        this.writeByte(int);
    }

    writeUInt8(uint) {
        this.writeInt8(uint >>> 0);
    }

    writeInt32(int) {
        this._buffer.push(
            (int >> 24) & 0xFF,
            (int >> 16) & 0xFF,
            (int >> 8) & 0xFF,
            int & 0xFF
        );
    }

    writeUInt32(uint) {
        this.writeInt32(uint >>> 0);
    }

    writeInt64(int) {
        this.writeInt32(int >>> 0);
        this.writeInt32(int);
    }

    writeUInt64(uint) {
        const low = uint & 0xFFFFFFFF;
        const high = (uint / 0x100000000) & 0xFFFFFFFF; // cannot use >> 32
        this.writeUInt32(high);
        this.writeUInt32(low);
    }

    writeInt16(short) {
        this.writeByte((short >> 8) & 0xFF);
        this.writeByte(short & 0xFF);
    }

    writeUInt16(ushort) {
        this.writeInt16(ushort >>> 0);
    }

    writeUByte(ubyte) {
        this.writeByte(ubyte);
    }

    writeStringNoLength(string) {
        const utf8Bytes = new TextEncoder().encode(string);
        this.writeBytes([...utf8Bytes]);
    }

    writeString(string) {
        const utf8Bytes = new TextEncoder().encode(string);
        this.writeUInt64(utf8Bytes.length);
        this.writeBytes([...utf8Bytes]);
    }

    writeBool(bool) {
        this.writeByte(bool ? 1 : 0);
    }

    writeFloat(float) {
        const view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, float);
        this.writeUInt32(view.getUint32(0));
    }

    writeDouble(double) {
        const view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, double);
        const high = view.getUint32(0);
        const low = view.getUint32(4);
        this.writeUInt32(high);
        this.writeUInt32(low);
    }

    get buffer() {
        return this._buffer;
    }

    get tempUrl() {
        return URL.createObjectURL(new Blob([new Uint8Array(this.buffer)]));
    }
}

class BinaryInStream {
    constructor(buffer) {
        if (buffer instanceof ArrayBuffer) {
            buffer = new Uint8Array(buffer);
        }

        if (buffer instanceof Uint8Array) {
            buffer = Array.from(buffer);
        }

        this._buffer = buffer;
        this._offset = 0;
    }

    readBytes(length) {
        const bytes = this._buffer.slice(this._offset, this._offset + length);
        this._offset += length;
        return bytes;
    }

    readByte() {
        return this.readBytes(1)[0];
    }

    readInt8() {
        return this.readByte();
    }

    readUInt8() {
        return this.readInt8() >>> 0;
    }

    readInt32() {
        const bytes = this.readBytes(4);
        return (
            (bytes[0] << 24) |
            (bytes[1] << 16) |
            (bytes[2] << 8) |
            bytes[3]
        );
    }

    readUInt32() {
        return this.readInt32() >>> 0;
    }

    readInt64() {
        const high = this.readInt32();
        const low = this.readInt32();
        return high * 0x100000000 + low;
    }

    readUInt64() {
        const high = this.readUInt32();
        const low = this.readUInt32();
        return high * 0x100000000 + low;
    }

    readInt16() {
        const bytes = this.readBytes(2);
        return (bytes[0] << 8) | bytes[1];
    }

    readUInt16() {
        return this.readInt16() >>> 0;
    }

    readUByte() {
        return this.readByte();
    }

    readStringNoLength(length) {
        const bytes = this.readBytes(length);
        const buffer = new Uint8Array(bytes);
        
        return new TextDecoder().decode(buffer);
    }

    readString() {
        const length = this.readUInt64();
        return this.readStringNoLength(length);
    }

    readBool() {
        return this.readByte() !== 0;
    }

    readFloat() {
        const view = new DataView(new ArrayBuffer(4));
        view.setUint32(0, this.readUInt32());
        return view.getFloat32(0);
    }

    readDouble() {
        const view = new DataView(new ArrayBuffer(8));
        view.setUint32(0, this.readUInt32());
        view.setUint32(4, this.readUInt32());
        return view.getFloat64(0);
    }

    get buffer() {
        return this._buffer;
    }

    set buffer(buffer) {
        this._buffer = buffer;
        this._offset = 0;
    }

    get offset() {
        return this._offset;
    }

    set offset(offset) {
        this._offset = offset;
    }

    seek(offset, whence = 0) {
        if (whence === 0) {
            this._offset = offset;
        } else if (whence === 1) {
            this._offset += offset;
        } else if (whence === 2) {
            this._offset = this._buffer.length - offset;
        }
    }

    checkNextIs(s) {
        const tencoder = new TextEncoder();
        const tbytes = tencoder.encode(s);
        
        return this.readStringNoLength(tbytes.length) == s;
    }
}
