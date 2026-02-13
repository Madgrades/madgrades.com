import { configureStore } from '@reduxjs/toolkit';
import utils from '../utils';

// Import slices
import appReducer from './slices/appSlice';
import coursesReducer from './slices/coursesSlice';
import instructorsReducer from './slices/instructorsSlice';
import subjectsReducer from './slices/subjectsSlice';
import gradesReducer from './slices/gradesSlice';
import exploreReducer from './slices/exploreSlice';

const api = utils.api.create(
  import.meta.env.VITE_MADGRADES_API || 'https://api.madgrades.com/',
  import.meta.env.VITE_MADGRADES_API_TOKEN,
);

export const store = configureStore({
  reducer: {
    app: appReducer,
    courses: coursesReducer,
    instructors: instructorsReducer,
    subjects: subjectsReducer,
    grades: gradesReducer,
    explore: exploreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
      serializableCheck: false, // May need to adjust based on data types
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
