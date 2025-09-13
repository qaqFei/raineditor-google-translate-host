window.escapeHtml = unsafe => unsafe.toString().replace(/[&<>"'`=/\x20]/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;",
    "=": "&#x3D;",
    "/": "&#x2F;",
    " ": "&nbsp;"
}[match] || match));
