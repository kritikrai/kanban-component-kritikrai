import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: { element: '#root' },
    layout: 'fullscreen'
  }
};

export default preview;