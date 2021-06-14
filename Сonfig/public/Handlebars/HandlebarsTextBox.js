"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _draftJs = require("draft-js");

var _draftjsConductor = require("draftjs-conductor");

var _debounce = _interopRequireDefault(require("debounce"));

var _draftJsPluginsEditor = _interopRequireDefault(require("draft-js-plugins-editor"));

var _draftToHandlebars = _interopRequireDefault(require("./draftToHandlebars"));

var _draftJsHandlebarsPlugin = _interopRequireDefault(require("draft-js-handlebars-plugin"));

require("./handlebarsTextBox.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var HandlebarsTextBox =
/*#__PURE__*/
function (_Component) {
  _inherits(HandlebarsTextBox, _Component);

  function HandlebarsTextBox(props) {
    var _this;

    _classCallCheck(this, HandlebarsTextBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HandlebarsTextBox).call(this, props));
    _this.state = {
      editorState: _this.props.value ? _draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromText(_this.props.value)) : _draftJs.EditorState.createEmpty()
    };
    _this.plugins = [(0, _draftJsHandlebarsPlugin["default"])()];
    _this.debouncedOnChange = (0, _debounce["default"])(_this.onChange, 300);
    _this._handleChange = _this._handleChange.bind(_assertThisInitialized(_this));
    _this._handlePaste = _this._handlePaste.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(HandlebarsTextBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.editor && this.editor.getEditorRef() && this.editor.getEditorRef().editor) {
        this.copySource = (0, _draftjsConductor.registerCopySource)(this.editor.getEditorRef());
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.copySource) {
        this.copySource.unregister();
      }
    }
  }, {
    key: "onChange",
    value: function onChange() {
      var editorState = this.state.editorState;
      var content = editorState.getCurrentContent();
      var value = (0, _draftToHandlebars["default"])(content);
      this.props.onChange(value);
    }
  }, {
    key: "_handlePaste",
    value: function _handlePaste(text, html, editorState) {
      if (html) {
        // TODO Strip jump of lines in html
        var parsed = (0, _draftjsConductor.handleDraftEditorPastedText)(html, editorState);

        if (parsed) {
          this._handleChange(parsed);

          return 'handled';
        }
      }

      this._handleChange(_draftJs.EditorState.push(editorState, _draftJs.Modifier.replaceText(this.state.editorState.getCurrentContent(), this.state.editorState.getSelection(), text.replace(/\n/g, ' '))));

      return 'handled';
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(editorState) {
      this.setState({
        editorState: editorState
      }, this.debouncedOnChange);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react["default"].createElement("div", {
        className: "handlebarsTextBox ".concat(this.props.className || ''),
        style: this.props.style || {}
      }, _react["default"].createElement(_draftJsPluginsEditor["default"], {
        spellCheck: true,
        ref: function ref(b) {
          return _this2.editor = b;
        },
        className: "handlebarsTextBox",
        onChange: this._handleChange,
        editorState: this.state.editorState,
        plugins: this.plugins,
        handleReturn: function handleReturn() {
          return 'handled';
        },
        handlePastedText: this._handlePaste,
        placeholder: this.props.placeholder
      }));
    }
  }]);

  return HandlebarsTextBox;
}(_react.Component);

HandlebarsTextBox.propTypes = {
  onChange: _propTypes["default"].func.isRequired,
  value: _propTypes["default"].string.isRequired,
  className: _propTypes["default"].string,
  style: _propTypes["default"].object,
  placeholder: _propTypes["default"].string
};
var _default = HandlebarsTextBox;
exports["default"] = _default;