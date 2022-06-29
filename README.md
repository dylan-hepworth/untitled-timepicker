# Untitled TimePicker

<p align="center">
    <img src="https://i.imgur.com/sekTOYo.gif" />
</p>

A simple reusable time picking component for React apps.

## Installation

Install using npm:

```sh
npm install --save untitled-timepicker
```

Install using yarn:

```sh
yarn add untitled-timepicker
```

## Usage

Here is a basic example of displaying the Untitled TimePicker in a React app.

```js
// import the library
import TimePicker from "untitled-timepicker";
// import styles
import "/untitled-timepicker/dist/index.css";

// Callback function which will returned the selected time from the component
const displayTime = (time) => {
  console.log(time);
};

function App() {
  return <TimePicker timeSelected={displayTime} />;
}

export default App;
```

## Prop Options/Configuration

| Prop Name                             | Type      | Default Value | Description                                                                                                                            |
| ------------------------------------- | --------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`timeSelected`](#timeselected)       | _func_    | () => {}      | The timeSelected function is called when the user selects a time. This will pass back the string of the selected time.                 |
| [`defaultTime`](#defaulttime)         | _string_  |               | The defaultTime string is the time that is selected by default.<br><br>**12 Hour example:** "09:49 AM"<br>**24 Hour example:** "09:49" |
| [`label`](#label)                     | _string_  |               | The label string is the label that is displayed above the time picker.                                                                 |
| [`showDropdown`](#showdropdown)       | _boolean_ | false         | The showDropdown boolean is true if the dropdown is shown when clicking on the input.                                                  |
| [`allowInlineEdit`](#allowinlineedit) | _boolean_ | true          | The allowInlineEdit boolean is true if the user can edit the time within the input.                                                    |
| [`use24HourForamt`](#use24hourformat) | _boolean_ | false         | The use24HourFormat boolean is true if the time is displayed in 24 hour format.                                                        |
| [`compactMode`](#compactmode)         | _boolean_ | false         | The compactMode boolean is true if the time picker is in compact mode. This will display a smaller time picker.                        |
| [`incrementBy`](#incrementby)         | _number_  | 0             | The incrementBy number is the number of minutes that the time picker increments by.<br><br>**Available options:** 5, 10, 15, 30, 60.   |
| [`hoursAvailable`](#hoursavailable)   | _array_   |               | An array of hours (numbers) that are to be used as the available hours.                                                                |

### timeSelected

More soon...

### defaultTime

More soon...

### label

<img src="https://i.imgur.com/QtwWTHK.png" />

### showDropdown

More soon...

### allowInlineEdit

<img src="https://i.imgur.com/HflJ2rq.gif" />

### use24HourFormat

<img src="https://i.imgur.com/JN29gK8.png" />

### compactMode

<img src="https://i.imgur.com/PGf54TT.png" />

<sub><sup>Compact mode in standard 12 hour format</sup></sub>

<img src="https://i.imgur.com/iaFQ2oY.png" />

<sub><sup>Compact mode in 24 hour mode (`use24HourFormat` set to `true`)</sup></sub>

### incrementBy

This prop is used to specify the incremental amount of minutes that are available to select. For example, if the value `15` was passed, then the available minutes to choose from would be `00, 15, 30, 45`. Likewise if the value `10` was supplied, the options `00, 10, 20, 30, 40, 50` would be available for selection.

<img src="https://i.imgur.com/pDPc75A.png" />

<sub><sup>Here the value `15` was passed</sup></sub>

### hoursAvailable

In some cases, users may wish to limit the number of hours availble to choose from. This array should include numbers between 1 and 23. Duplicates will automaticall be removed. The hours will also automatically be sorted.

If `hoursAvailable` is provided an array `[1, 2, 3, 4, 5]`, then the time picker will display the hours "01", "02", "03", "04", and "05".

If `hoursAvailble` is provided an array, the hour with the smallest value will automatically be selected. In the previous example, "01" would be selected. However, the value of `defaultTime` will override the hour value in this case.

<img src="https://i.imgur.com/0cjNx7i.png" />

<sub><sup>The array `[4, 5, 6]` was passed to `hoursAvailable`</sup></sub>

**Enjoy!**
