import { getRandomNumber, getRandomArrayElement } from '../utils';
import { DESCRIPTIONS } from '../const';

export const mockDestinations = [
  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    description: 'Moscow is the capital and largest city of Russia, a vibrant megacity that blends centuries of history with modern innovation. Located on the Moskva River, it serves as the nations political, economic, and cultural heart.',
    name: 'Moscow',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },

  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcac',
    description: 'Paris, often called the “City of Light” (La Ville Lumière), is the capital of France and one of the world’s most iconic centers for art, fashion, and gastronomy.',
    name: 'Paris',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },

  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcad',
    description: 'Tokyo is the capital of Japan and the worlds most populous metropolitan area, home to over 37 million people. It is a high-tech megacity where futuristic skyscrapers stand alongside ancient wooden temples.',
    name: 'Tokio',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },

  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcae',
    description: 'Rome is the capital of Italy, widely known as the "Eternal City" (la Città Eterna).',
    name: 'Rome',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },

  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcaf',
    description: 'Minsk is the capital and largest city of Belarus, located at the geographical heart of the country on the Svisloch River.',
    name: 'Minsk',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },

  {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcag',
    description: 'London is the capital of the United Kingdom and one of the worlds oldest and most influential global cities.',
    name: 'London',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      },

      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber()}`,
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  }
];
