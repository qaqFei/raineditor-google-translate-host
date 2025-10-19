if (typeof __createMWSD !== "function") {
    throw new Error("mwsd.js must be loaded before mwsd-warp.js");
}

class MWSDContext {
    constructor() { }
    async init() {
        await __mswd_warp_loaded;
        this._mctx = __mswd_module._CreateMCtx();
        this._malloced_addr = 0;
        this._malloced_size = -1;
    }

    set_magic_header(header) {
        __mswd_module._SetMHeader(this._mctx, header);
    }

    random_mheader() {
        const header = (Math.random() * 0x100000000) | 0;
        this.set_magic_header(header);
        return header;
    }

    set_uint8_arr(u8arr) {
        if (this._malloced_size !== u8arr.length) {
            if (this._malloced_addr !== 0) {
                __mswd_module._free(this._malloced_addr);
            }

            this._malloced_addr = __mswd_module._malloc(u8arr.length);
            this._malloced_size = u8arr.length;
        }

        __mswd_module.HEAPU8.set(u8arr, this._malloced_addr);
        __mswd_module._SetMBody(this._mctx, this._malloced_addr, u8arr.length);
    }

    set_empty_data(size) {
        if (this._malloced_addr == 0 || this._malloced_size != size) {
            const buffer = new Uint8Array(size);
            this.set_uint8_arr(buffer);
        } else {
            __mswd_module.HEAPU8.fill(0, this._malloced_addr, this._malloced_addr + size);
        }
    }

    set_imagedata_tobgr(imgdata) {
        if (this._malloced_size != imgdata.data.length) {
            this.set_uint8_arr(imgdata.data);
        } else {
            // refuse size
            __mswd_module._SetMBody(this._mctx, this._malloced_addr, this._malloced_size);
        }

        __mswd_module._MBodyRGBAToBGR(this._mctx);
    }
}

window.__mswd_warp_loaded = (async () => {
    window.__mswd_module = await __createMWSD();
})();
