package com.androidnativemodule;

import android.util.Log;

import androidx.annotation.NonNull;

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

    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        Log.d(getName(), "Create event called with name: " + name + " and location: " + location);
    }
}
