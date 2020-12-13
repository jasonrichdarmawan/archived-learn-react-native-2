package com.androidnativemodule;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class CalendarModule extends ReactContextBaseJavaModule {
    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("DEFAULT_EVENT_NAME", "New Event");
        return constants;
    }

    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

//    the last argument to a native module method call, if it's a function, is treated as the successCallback,
//    and the second to last argument to a native module method call, if it's a function, is treated as the failure callback.
    @ReactMethod
    public void createCalendarEvent(String name, String location, Callback failureCallback, Callback successCallback) {
        Log.d(getName(), "Create event called with name: " + name + " and location: " + location);
        double eventID = 1;
        failureCallback.invoke("error");

//        a native module method can only invoke one callback, one time.
//        successCallback.invoke(eventID);
    }

    @ReactMethod
    public void createCalendarEventPromise(String name, String location, Promise promise) {
        try {
            double eventID = 1;
            throw new Exception("test");
//            promise.resolve(eventID);
        } catch (Exception e) {
            promise.reject("Create Event Error", "Error message", e);
        }
    }
}
