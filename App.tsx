import 'react-native-gesture-handler'
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Navigation from './src/navigation';
import store from './src/app/store';
import { MenuProvider } from 'react-native-popup-menu'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';




let persistor = persistStore(store);

const App = () => {


  return (
    
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MenuProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Navigation />
          </GestureHandlerRootView>
        </MenuProvider>
      </PersistGate>
    </Provider>
     
  
  );
};

export default App;
