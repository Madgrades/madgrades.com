# TypeScript Migration Guide

This project has been migrated to TypeScript with Redux Toolkit. This document provides guidance for developers working with the new Redux setup.

## Redux Toolkit Store Structure

The Redux store is now managed using Redux Toolkit with the following structure:

```
src/
  store/
    index.ts              # Store configuration
    hooks.ts              # Typed hooks (useAppSelector, useAppDispatch)
    slices/
      appSlice.ts         # App state (search, filters, terms)
      coursesSlice.ts     # Course data and search
      instructorsSlice.ts # Instructor data and search
      subjectsSlice.ts    # Subject data and search
      gradesSlice.ts      # Grade distributions
      exploreSlice.ts     # Explore page data
```

## Using TypeScript with Redux

### Typed Hooks

Use the typed hooks instead of plain `useDispatch` and `useSelector`:

```typescript
import { useAppDispatch, useAppSelector } from './store/hooks';

function MyComponent() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses);
  // ...
}
```

### Dispatching Actions

All async actions use `createAsyncThunk`:

```typescript
import { fetchCourse } from './store/slices/coursesSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchCourse('some-uuid'));
  }, [dispatch]);
}
```

### Accessing State with Selectors

Use the exported selectors from each slice:

```typescript
import { selectCourse } from './store/slices/coursesSlice';
import { useAppSelector } from './store/hooks';

function CourseDetails({ uuid }) {
  const course = useAppSelector(selectCourse(uuid));
  // ...
}
```

## TypeScript Configuration

### Strict Mode

The project uses strict TypeScript settings:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- All strict checks enabled

### Type Checking

Run type checking:
```bash
npm run type-check
```

### Linting

Run ESLint:
```bash
npm run lint
```

Note: The lint configuration currently allows `any` types as warnings during the migration. These should be gradually replaced with proper types.

## CI/CD Integration

The GitHub Actions workflow now includes:
1. **Type checking** - Ensures no TypeScript errors
2. **Linting** - Checks code quality and style
3. **Build** - Builds the project

All checks must pass before merging PRs.

## Migration Status

### Completed
- ✅ All Redux slices migrated to TypeScript
- ✅ Redux Toolkit with `createAsyncThunk` for all async operations
- ✅ Typed `RootState` and `AppDispatch`
- ✅ Typed hooks (`useAppSelector`, `useAppDispatch`)
- ✅ CI/CD pipeline with type-check and lint
- ✅ Build system configured for TypeScript

### Future Work
- Migrate React components to TypeScript
- Add proper types for API responses
- Replace `any` types with proper interfaces
- Add unit tests for slices
- Consider RTK Query for data fetching

## Best Practices

1. **Always use typed hooks** - Never use plain `useDispatch` or `useSelector`
2. **Use selectors** - Export and use selector functions from slices
3. **Type your components** - As you touch components, convert them to TypeScript
4. **Avoid `any`** - Use proper types or create interfaces for complex data
5. **Test your changes** - Run `npm run type-check` and `npm run build` before committing

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
