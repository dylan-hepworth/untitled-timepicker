import { useRef, useState, useEffect, React } from 'react';
import PropTypes from 'prop-types';

/**
 * @description - The Untitled TimePicker component is a React component that allows the user to select a time.
 * @param {object} props - The props object contains the following properties:
 * @param {function} props.timeSelected - The timeSelected function is called when the user selects a time. This will pass back the string of the selected time.
 * @param {string} props.defaultTime - The defaultTime string is the time that is selected by default.
 * 12 Hour example: "09:49 AM"
 * 24 Hour example: "09:49"
 * @param {string} props.label - The label string is the label that is displayed above the time picker.
 * @param {boolean} props.showDropdown - The showDropdown boolean is true if the dropdown is shown when clicking on the input.
 * @param {boolean} props.allowInlineEdit - The allowInlineEdit boolean is true if the user can edit the time within the input.
 * @param {boolean} props.use24HourFormat - The use24HourFormat boolean is true if the time is displayed in 24 hour format.
 * @param {boolean} props.compactMode - The compactMode boolean is true if the time picker is in compact mode. This will display a smaller time picker.
 * @param {number} props.incrementBy - The incrementBy number is the number of minutes that the time picker increments by. Available options: 5, 10, 15, 30, 60. 
 * @param {array} props.hoursAvailable - An array of hours (numbers) that are to be used as the available hours. For example, if the hours array is [1, 2, 3, 4, 5], then the time picker will display the hours "01", "02", "03", "04", and "05".
 * @returns The Untitled TimePicker component.
 */

const TimePicker = ({
  timeSelected = () => {},
  defaultTime,
  label,
  showDropdown = true,
  allowInlineEdit = true,
  use24HourFormat = false,
  compactMode = false,
  incrementBy = 0,
  hoursAvailable
}) => {
  const date = new Date();
  const wrapperRef = useRef();
  const hourInputRef = useRef();
  const minuteInputRef = useRef();
  const morningNightInputRef = useRef();
  const hourDropDownRef = useRef();
  const minuteDropDownRef = useRef();
  const morningNightDropDownRef = useRef(); // Is the dropdown open?

  const [isOpen, setIsOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(defaultTime || ""); // The select hour. By default set to current hour (1-12)

  const [selectedHour, setSelectedHour] = useState("12"); // The select minute. By default set to current minute

  const [selectedMinute, setSelectedMinute] = useState("00"); // The selected AM/PM. By default set to current AM/PM

  const [selectedAmPm, setSelectedAmPm] = useState("AM");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // When the component loads for the first time, if there is a default time, make sure that it matches the correct format.

  useEffect(() => {
    // Setup an click event listener on the entire document to track when the user clicks outside of the component.
    document.addEventListener("click", handleOutsideClick); // If a default time was provided, make sure that it matches the 24 hour format, otherwise check the format for a 12 hour format.

    if (defaultTime) {
      if (use24HourFormat) {
        // Trigger the component to display 
        if (!defaultTime.match(/^(\d{2}):(\d{2})$/)) {
          setShowError(true);
          setErrorMessage("Invalid time format. Please use the format: HH:MM AM/PM");
        }
      } else {
        if (!defaultTime.match(/^(\d{2}):(\d{2})\s([PpAa][Mm])$/)) {
          setShowError(true);
          setErrorMessage("Invalid time format. Please use the format: HH:MM AM/PM");
        }
      }
    } // Set the hour


    let hour; // If the `defaultTime` prop is provided, default to that value.

    if (defaultTime) {
      hour = parseInt(defaultTime.split(":")[0]);
    } else {
      // If an array was passed to the `hoursAvailable` prop, use the smallest hour in the array.
      if (hoursAvailable?.length) {
        hour = Math.min(...hoursAvailable);
      } else {
        if (use24HourFormat) {
          hour = date.getHours();
        } else {
          hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        }
      }
    } // Update the dropdown value


    updateInlineHour(hour.toString()); // Set the minute

    let minute;

    if (defaultTime) {
      minute = defaultTime.split(":")[1].split(" ")[0];
    } else {
      // Make sure we add a "0" in front of the minute if it's less than 10.
      minute = "0" + date.getMinutes().toString().slice(-2);
    } // Update the dropdown value


    updateInlineMinute(minute.toString());

    if (!use24HourFormat) {
      // Set the AM/PM
      let amPm;

      if (defaultTime) {
        amPm = defaultTime.split(" ")[1].toUpperCase();
      } else {
        amPm = date.getHours() >= 12 ? "PM" : "AM";
      }

      updateInlineAmPm(amPm);
    }
  }, []); // Keep reference to each value once set so that we can add the value back to the inputs if set and click away

  const [prevSetHour, setPrevSetHour] = useState(selectedHour);
  const [prevSetMinute, setPrevSetMinute] = useState(selectedMinute);
  const [prevSetMorningNight, setPrevSetMorningNight] = useState(selectedAmPm);
  useEffect(() => {
    const handleUpdateDisplayTime = () => {
      let time = selectedHour || "00";
      time += ":";
      time += selectedMinute || "00";
      time += " " + selectedAmPm;
      setTimeValue(time);
    };

    handleUpdateDisplayTime();
  }, [selectedHour, selectedMinute, selectedAmPm]); // Call the callback function and pass the selected time

  useEffect(() => {
    if (timeValue) {
      timeSelected(timeValue);
    }
  }, [timeSelected, timeValue]); // Bold the selected time that was clicked, remove the bold from the other times, and scroll the selected time into view.

  const handleBoldSelectedTimeItem = e => {
    const parent = e.target.parentElement;

    for (let child of parent.children) {
      if (child.nodeName === "DIV") {
        for (let subChild of child.children) {
          subChild.style.fontWeight = "normal";
        }
      }

      child.style.fontWeight = "normal";
    }

    if (parent.nodeName === "DIV") {
      for (let child of parent.parentElement.children) {
        child.style.fontWeight = "normal";
      }
    } // Scroll the item to the top of the list so that it's easily visible to the user.


    if (parent.nodeName === "DIV") {
      // Handle the 00 and 01 cases. Here since they have their own div wrapper, we need to get the parent's parent.
      parent.parentElement.scroll({
        top: e.target.offsetTop,
        behavior: "smooth"
      });
    } else {
      parent.scroll({
        top: e.target.offsetTop,
        behavior: "smooth"
      });
    }

    e.target.style.fontWeight = "bold";
  }; // When the hour value is selected, set the selected hour


  const onSelectedHour = e => {
    handleBoldSelectedTimeItem(e);
    setSelectedHour(e.target.innerText);
  }; // When the minute value is selected, set the selected minute


  const onSelectedMinute = e => {
    handleBoldSelectedTimeItem(e);
    setSelectedMinute(e.target.innerText);
  }; // When the AM/PM value is selected, set the selected AM/PM


  const onSelectedAmPm = e => {
    handleBoldSelectedTimeItem(e);
    setSelectedAmPm(e.target.innerText);
  };

  const generateTime = type => {
    let num;

    if (use24HourFormat) {
      num = 23;
    } else {
      num = 12;
    }

    let clickEvent = onSelectedHour;

    if (type === "minute") {
      num = 59;
      clickEvent = onSelectedMinute;
    }

    if (hoursAvailable?.length && type === "hour") {
      // Get all the unique hours available
      [...new Set(hoursAvailable)]; // Sort the hours in ascending order


      return hoursAvailable.map((hour, i) => {
        hour = ("0" + hour).slice(-2);
        return /*#__PURE__*/React.createElement("li", {
          key: i,
          onClick: clickEvent
        }, hour);
      });
    } else {
      return [...Array(num)].map((e, i) => {
        const val = "0" + (i + 1).toString();

        if (i === 0 && type === "minute" || i === 0 && use24HourFormat) {
          if (incrementBy > 0) {
            return (
              /*#__PURE__*/
              // We have to set a key for the div wrapper so that we don't receive an error
              React.createElement("div", {
                key: "b"
              }, /*#__PURE__*/React.createElement("li", {
                key: -1,
                onClick: clickEvent
              }, "00"))
            );
          } else {
            return (
              /*#__PURE__*/
              // We have to set a key for the div wrapper so that we don't receive an error
              React.createElement("div", {
                key: "b"
              }, /*#__PURE__*/React.createElement("li", {
                key: -1,
                onClick: clickEvent
              }, "00"), /*#__PURE__*/React.createElement("li", {
                key: i,
                onClick: clickEvent
              }, val.slice(-2)))
            );
          }
        } else {
          if (type === "minute" && incrementBy > 0) {
            if (i % incrementBy === 0) {
              return /*#__PURE__*/React.createElement("li", {
                key: i,
                onClick: clickEvent
              }, val.slice(-2) - 1);
            }
          } else {
            return /*#__PURE__*/React.createElement("li", {
              key: i,
              onClick: clickEvent
            }, val.slice(-2));
          }
        }
      });
    }
  };

  const handleOutsideClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target) {
      let parentElement = e.target.parentElement;
      let clickedInComponent = false;

      while (parentElement) {
        if (parentElement.classList.contains("time_picker_wrapper") || parentElement.classList.contains("time_picker_input")) {
          clickedInComponent = true;
          break;
        }

        parentElement = parentElement.parentElement;
      }

      if (clickedInComponent) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  };
  /**
      * @description - This function is used to select the time from the dropdown.
      * @param {string} input 
      * @param {string} type 
      * @param {object} ref 
      * @returns 
      */


  const handleInputMask = (input, type, ref) => {
    let val = input;

    if (!/^[0-9]+$/i.test(input[input.length - 1])) {
      val = val.slice(0, -1);
    }

    if (val.length >= 2) {
      if (type === "minute") {
        if (val > 59) {
          val = val.slice(0, -1);
        } else {
          // When we first pass in the minute value, there is no "0" in front of it so it will only be 2 digits long. Use that value.
          // Otherwise check if the value passed was "00"
          if (val.length !== 2 && val !== "00") {
            val = val.slice(1);
          } // If the incrementBy prop has been set to anything greater than 0, then we need to check the value that was entered and "snap" it to the closest available time.


          if (incrementBy > 0) {
            if (parseInt(val) % incrementBy !== 0) {
              if (val % incrementBy <= incrementBy / 2) {
                val = parseInt(val) - parseInt(val) % incrementBy;
              } else {
                val = parseInt(val) + incrementBy - parseInt(val) % incrementBy;
              }
            }

            if (val === 0) {
              val = "00";
            } // Check to see if the value is greater than the max value available within the incrementBy prop.


            if (parseInt(val) > 60 - incrementBy) {
              val = parseInt(val) - incrementBy;
            }
          } // Change focus to the next reference


          if (ref) {
            // Set the minute to reference in case we click away
            setPrevSetMinute(val);
            setTimeout(() => {
              if (ref.current) {
                ref.current.focus();
              }
            }, 100);
          }
        }
      } else {
        if (!use24HourFormat) {
          if (val[0] === "0") {
            val = val.slice(1);
          } else {
            val = val.slice(0, 2);
          }
        }

        if (use24HourFormat && val > 23) {
          val = val.slice(0, -1);
        } else if (!use24HourFormat && val > 12) {
          val = val.slice(0, -1);
        } else {
          // Set the hour to reference in case we click away
          setPrevSetHour(val); // Change focus to the next reference

          if (ref) {
            setTimeout(() => {
              ref.current.focus();
            }, 200);
          }
        }
      }
    }

    if (!use24HourFormat) {
      if (val.length === 1 && val > 0) {
        val = "0" + val;

        if (val > 1 && type === "hour") {
          if (ref) {
            setTimeout(() => {
              ref.current.focus();
            }, 100);
          }
        }
      }
    } // Update the dropdown list with the new value


    updateDropDownValue(val, type);
    return val;
  };

  const updateDropDownValue = (val, type) => {
    val = val.toString();

    const highlightItem = ref => {
      for (let child of ref.current.children) {
        if (child.nodeName === "DIV") {
          for (let subChild of child.children) {
            if (subChild.innerText === val) {
              handleBoldSelectedTimeItem({
                target: subChild
              });
            }
          }
        } else {
          if (child.innerText === val) {
            handleBoldSelectedTimeItem({
              target: child
            });
          }
        }
      }
    };

    switch (type) {
      case "hour":
        highlightItem(hourDropDownRef);
        break;

      case "minute":
        highlightItem(minuteDropDownRef);
        break;

      case "ampm":
        highlightItem(morningNightDropDownRef);
        break;
    }
  }; // Update the hour section of the dropdown list to bold the matching hour


  const updateInlineHour = e => {
    let input;

    if (typeof e === "string" || typeof e === "number") {
      if (parseInt(e) < 10) {
        input = "0" + parseInt(e);
      } else {
        input = e;
      }
    } else {
      input = e.target.value;
    }

    const val = handleInputMask(input, "hour", minuteInputRef);
    setSelectedHour(val);
  };

  const handleEditHour = () => {
    if (!prevSetHour) {
      setSelectedHour("");
    } else {
      hourInputRef.current.select();
    }
  };
  /**
      * Update the minute section of the dropdown list to bold the matching minute
      * @param {object|string|number} e 
      * @returns {void}
      */


  const updateInlineMinute = e => {
    let input;

    if (typeof e === "string" || typeof e === "number") {
      if (parseInt(e) < 10) {
        input = "0" + parseInt(e);
      } else {
        input = e;
      }
    } else {
      input = e.target.value;
    }

    const val = handleInputMask(input, "minute", morningNightInputRef);
    setSelectedMinute(val);
  };

  const handleEditMinute = () => {
    if (!prevSetMinute) {
      setSelectedMinute("");
    } else {
      minuteInputRef.current.select();
    }
  };

  const handleEnterPressAmPm = e => {
    // If the up or down arrow is pressed, swap AM/PM selected value
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (selectedAmPm === "AM") {
        setSelectedAmPm("PM");
        updateInlineAmPm("PM", false);
      } else {
        setSelectedAmPm("AM");
        updateInlineAmPm("AM", false);
      } // If the enter or Esc key is pressed, update the time and remove focus from the input

    } else if (e.key === "Enter" || e.key === "Escape") {
      if (selectedAmPm === "") {
        setSelectedAmPm(prevSetMorningNight);
      }

      setIsOpen(false);
      wrapperRef.current.focus();
    }
  };

  const handleHourBlur = () => {
    if (selectedHour === "" || selectedHour.length < 2) {
      setSelectedHour(prevSetHour);
    }
  };

  const handleMinuteBlur = () => {
    if (selectedMinute === "" || selectedMinute.length < 2) {
      setSelectedMinute(prevSetMinute);
    }
  };

  const handleAmPmBlur = () => {
    if (selectedAmPm === "") {
      setSelectedAmPm(prevSetMorningNight);
    }
  };

  const updateInlineAmPm = (e, closeDropdown = true) => {
    let val;

    if (typeof e === "string" || typeof e === "number") {
      val = e[0].toUpperCase();
    } else {
      val = e.target.value.toUpperCase();
    }

    if (val !== "A" && val !== "P") {
      setSelectedAmPm("");
    } else {
      val = val + "M";
      setSelectedAmPm(val);
      setPrevSetMorningNight(val);

      for (let child of morningNightDropDownRef.current.children) {
        if (child.innerText === val) {
          handleBoldSelectedTimeItem({
            target: child
          });
        }
      }

      if (closeDropdown) {
        setIsOpen(false);
      }
    }

    if (closeDropdown) {
      setTimeout(() => {
        // Give the DOM time to update then focus on the next hidden input
        wrapperRef.current.focus();
      }, 200);
    }
  };

  const handleEditAmPm = () => {
    if (!prevSetMorningNight) {
      setSelectedAmPm("");
    } else {
      morningNightInputRef.current.select();
    }
  }; // While inline editing, if the escape key is pressed, close the dropdown and remove focus from the inputs.
  // If enter is pressed, use the current time and move input to the next input.


  const handleExitInput = e => {
    if (e.key === "Escape") {
      wrapperRef.current.focus();
      setIsOpen(false);
    }

    if (e.key === "Enter") {
      if (e.target.classList.contains("hour")) {
        minuteInputRef.current.focus();
      } else {
        morningNightInputRef.current.focus();
      }
    }
  };

  if (showError) {
    return /*#__PURE__*/React.createElement("div", {
      className: "time_picker_wrapper error"
    }, "Error: ", errorMessage);
  } else {
    return /*#__PURE__*/React.createElement("div", null, label && /*#__PURE__*/React.createElement("p", {
      className: "label"
    }, label), /*#__PURE__*/React.createElement("div", {
      className: `time_picker_wrapper ${showDropdown && isOpen ? "selection_open" : ""} ${compactMode ? "compact_mode" : ""} ${use24HourFormat ? "twenty_four_hour" : ""}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "time_picker_input"
    }, /*#__PURE__*/React.createElement("input", {
      className: "time_input hour",
      type: "text",
      value: selectedHour,
      disabled: !allowInlineEdit,
      onChange: updateInlineHour,
      onKeyUp: handleExitInput,
      onClick: handleEditHour,
      onFocus: handleEditHour,
      onBlur: handleHourBlur,
      ref: hourInputRef
    }), /*#__PURE__*/React.createElement("span", null, ":"), /*#__PURE__*/React.createElement("input", {
      className: "time_input",
      type: "text",
      value: selectedMinute,
      disabled: !allowInlineEdit,
      onChange: updateInlineMinute,
      onKeyUp: handleExitInput,
      onClick: handleEditMinute,
      onFocus: handleEditMinute,
      onBlur: handleMinuteBlur,
      ref: minuteInputRef
    }), !use24HourFormat && /*#__PURE__*/React.createElement("input", {
      className: "time_input",
      type: "text",
      value: selectedAmPm,
      disabled: !allowInlineEdit,
      onChange: updateInlineAmPm,
      onKeyUp: handleEnterPressAmPm,
      onClick: handleEditAmPm,
      onFocus: handleEditAmPm,
      onBlur: handleAmPmBlur,
      ref: morningNightInputRef
    }), /*#__PURE__*/React.createElement("input", {
      className: "time_input",
      type: "text",
      ref: wrapperRef
    })), /*#__PURE__*/React.createElement("div", {
      className: `selection_wrapper ${showDropdown && isOpen ? "" : "hidden"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "dropdown_wrapper"
    }, /*#__PURE__*/React.createElement("ul", {
      ref: hourDropDownRef
    }, generateTime("hour"))), /*#__PURE__*/React.createElement("div", {
      className: "dropdown_wrapper"
    }, /*#__PURE__*/React.createElement("ul", {
      ref: minuteDropDownRef
    }, generateTime("minute"))), /*#__PURE__*/React.createElement("div", {
      className: `dropdown_wrapper ${use24HourFormat ? "hidden" : ""}`
    }, /*#__PURE__*/React.createElement("ul", {
      ref: morningNightDropDownRef
    }, /*#__PURE__*/React.createElement("li", {
      onClick: onSelectedAmPm
    }, "AM"), /*#__PURE__*/React.createElement("li", {
      onClick: onSelectedAmPm
    }, "PM"))))));
  }
};
TimePicker.propTypes = {
  timeSelected: PropTypes.func.isRequired,
  defaultTime: PropTypes.string,
  label: PropTypes.string,
  showDropdown: PropTypes.bool,
  allowInlineEdit: PropTypes.bool,
  use24HourFormat: PropTypes.bool,
  compactMode: PropTypes.bool,
  incrementBy: PropTypes.oneOf([0, 5, 10, 15, 30, 60]),
  hoursAvailable: PropTypes.arrayOf(PropTypes.number)
};

export { TimePicker };
