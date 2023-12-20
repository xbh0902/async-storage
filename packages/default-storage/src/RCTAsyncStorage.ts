import { NativeModules, TurboModuleRegistry, Platform } from "react-native";
import { shouldFallbackToLegacyNativeModule } from "@react-native-async-storage/async-storage/src/shouldFallbackToLegacyNativeModule";

// TurboModuleRegistry falls back to NativeModules so we don't have to try go
// assign NativeModules' counterparts if TurboModuleRegistry would resolve
// with undefined.
let RCTAsyncStorage = TurboModuleRegistry
  ? Platform.OS === "harmony"
    ? TurboModuleRegistry.get("RNCAsyncStorage")
    : TurboModuleRegistry.get("PlatformLocalStorage") || // Support for external modules, like react-native-windows
      TurboModuleRegistry.get("RNC_AsyncSQLiteDBStorage") ||
      TurboModuleRegistry.get("RNCAsyncStorage")
  : NativeModules["PlatformLocalStorage"] || // Support for external modules, like react-native-windows
    NativeModules["RNC_AsyncSQLiteDBStorage"] ||
    NativeModules["RNCAsyncStorage"];

if (!RCTAsyncStorage && shouldFallbackToLegacyNativeModule()) {
  if (TurboModuleRegistry) {
    RCTAsyncStorage =
      TurboModuleRegistry.get("AsyncSQLiteDBStorage") ||
      TurboModuleRegistry.get("AsyncLocalStorage");
  } else {
    RCTAsyncStorage =
      NativeModules["AsyncSQLiteDBStorage"] ||
      NativeModules["AsyncLocalStorage"];
  }
}

export default RCTAsyncStorage;
