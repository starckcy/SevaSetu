import { useEffect } from "react";

import { firebaseService } from "../services/firebase";

export function useRealtimeCollection(enabled, collectionName, onData) {
  useEffect(() => {
    if (!enabled || !firebaseService.configured) {
      return undefined;
    }

    return firebaseService.subscribeToCollection(collectionName, onData);
  }, [collectionName, enabled, onData]);
}
