import { TimePicker } from "../components/TimePicker/TimePicker";

// Set default Storybook parameters
export default {
    title: 'Untitled TimePicker',
    component: TimePicker,
    argTypes: {
        timeSelected: { action: 'Time Selected' }
    }
};

const timeWasSelected = (time) => {}

// Storybook template
const Template = ({ ...args }) => {
    return (
        <div>
            <TimePicker timeSelected={timeWasSelected} {...args} />
        </div>
    );
};

// The Primary Layout
export const Primary = Template.bind();

export const DefaultTime = Template.bind();
DefaultTime.args = {
    defaultTime: '12:00 AM'
};

export const WithLabel = Template.bind();
WithLabel.args = {
    label: 'Select a time'
};
