package network.omisego.plasmawallet.schedule;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.Nullable;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class TaskSchedulerService extends HeadlessJsTaskService {

    @Nullable
    @Override
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            String taskType = extras.getString(Task.BUNDLE_EXTRA_TASK_TYPE);
            Log.d("TaskSchedulerService", "Sent!");
            return new HeadlessJsTaskConfig(
                    taskType,
                    Arguments.fromBundle(extras),
                    5 * 60 * 1000, // timeout for the task (5 mins)
                    true
            );
        }
        return null;
    }
}
