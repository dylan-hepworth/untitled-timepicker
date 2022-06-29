'use strict';

require('react');
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

({
  timeSelected: PropTypes__default["default"].func.isRequired,
  defaultTime: PropTypes__default["default"].string,
  label: PropTypes__default["default"].string,
  showDropdown: PropTypes__default["default"].bool,
  allowInlineEdit: PropTypes__default["default"].bool,
  use24HourFormat: PropTypes__default["default"].bool,
  compactMode: PropTypes__default["default"].bool,
  incrementBy: PropTypes__default["default"].oneOf([0, 5, 10, 15, 30, 60]),
  hoursAvailable: PropTypes__default["default"].arrayOf(PropTypes__default["default"].number)
});
