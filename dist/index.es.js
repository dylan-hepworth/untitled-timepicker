import 'react';
import PropTypes from 'prop-types';

({
  timeSelected: PropTypes.func.isRequired,
  defaultTime: PropTypes.string,
  label: PropTypes.string,
  showDropdown: PropTypes.bool,
  allowInlineEdit: PropTypes.bool,
  use24HourFormat: PropTypes.bool,
  compactMode: PropTypes.bool,
  incrementBy: PropTypes.oneOf([0, 5, 10, 15, 30, 60]),
  hoursAvailable: PropTypes.arrayOf(PropTypes.number)
});
