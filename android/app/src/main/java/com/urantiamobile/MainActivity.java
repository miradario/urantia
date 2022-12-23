package com.urantiamobile;

import com.facebook.react.ReactActivity;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "UrantiaMobile";
  }
  
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    if (savedInstanceState != null) {
      savedInstanceState.remove("android:support:fragments");
      savedInstanceState.remove("android:fragments");
    }
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    if (outState != null) {
      outState.clear();
    }
  }
}
