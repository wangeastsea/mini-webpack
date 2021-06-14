
        (function(modules) {
            function require(id) {
                const [fn, mapping] = modules[id]
                function localRequire(relativePath) {
                    return require(mapping[relativePath])
                }
                const module = {exports: {}}
                fn(localRequire, module, module.exports)
                return module.exports
            }
            require(0)
        }
        )({0:[
            function(require, module, exports) {
                "use strict";

var _operate = require("./operate.js");

var _operate2 = _interopRequireDefault(_operate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_operate2.default);
            },
            {"./operate.js":1}
        ],1:[
            function(require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _add = require("./add.js");

var _add2 = _interopRequireDefault(_add);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _add2.default)(5, 5);
            },
            {"./add.js":2}
        ],2:[
            function(require, module, exports) {
                "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function add(a, b) {
  return a + b;
}
exports.default = add;
            },
            {}
        ],})
    
