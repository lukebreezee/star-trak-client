import { createStore } from 'redux';
import { persistedReducer } from './reducer';
import { persistStore } from 'redux-persist';

//Creating store

const store = createStore(persistedReducer);

// Use redux persist to cache the store (explained in ./reducer)

const persistor = persistStore(store);

// Export both

export { store, persistor };