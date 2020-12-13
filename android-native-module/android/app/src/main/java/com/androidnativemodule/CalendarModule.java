package com.androidnativemodule;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class CalendarModule extends ReactContextBaseJavaModule {
    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }

    CalendarModule(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        Log.d(getName(), "Create event called with name: " + name + " and location: " + location);
    }
}
