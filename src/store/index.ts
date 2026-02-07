import { configureStore } from '@reduxjs/toolkit';
// import logger from 'redux-logger';
import utils from '../utils';
import appReducer from './slices/appSlice';
import coursesReducer from './slices/coursesSlice';
import instructorsReducer from './slices/instructorsSlice';
import subjectsReducer from './slices/subjectsSlice';
import gradesReducer from './slices/gradesSlice';
import exploreReducer from './slices/exploreSlice';

// Root reducer
const rootReducer = {
  app: appReducer,
  courses: coursesReducer,
  instructors: instructorsReducer,
  subjects: subjectsReducer,
  grades: gradesReducer,
  explore: exploreReducer,
};

const api = utils.api.create(
  import.meta.env.VITE_MADGRADES_API || "https://api.madgrades.com/",
  import.meta.env.VITE_MADGRADES_API_TOKEN,
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }).concat(
      // Conditionally add logger in development
      // logger
    ),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
