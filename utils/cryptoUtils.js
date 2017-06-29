/**
 * Created by leiyao on 16/3/27.
 */

var crypto = require('crypto');

exports.md5 = (str) => {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}