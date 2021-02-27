export class EventDispatcher {
  private _listeners = new Map<string, Set<Function>>();

  public on(type: string, listener: Function): void {
    const listeners = this._listeners;
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }

    const callbacks = listeners.get(type);
    if (!callbacks.has(listener)) {
      callbacks.add(listener);
    }

    return this;
  }

  public off(type, listener) {
    const listeners = this._listeners;
    const callbacks = listeners.get(type);
    if (callbacks?.has(listener)) {
      callbacks.delete(listener);
    }

    return this;
  }

  public dispatch(event: object): void {
    var listeners = this._listeners;
    var callbacks = listeners.get(event.type);

    if (!callbacks) return;

    for (const callback of callbacks) {
      callback.call(this, event);
    }
  }
}
