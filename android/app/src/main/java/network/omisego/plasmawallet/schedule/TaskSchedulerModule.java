package network.omisego.plasmawallet.schedule;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.*;

import java.util.ArrayList;
import java.util.Map;

public class TaskSchedulerModule extends ReactContextBaseJavaModule {
    private AlarmManager mAlarmManager;
    private ArrayList<Task> mTasks;
    private Context context;


    public TaskSchedulerModule(ReactApplicationContext context) {
        super(context);
        this.mAlarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        this.mTasks = new ArrayList<>();
        this.context = context;
    }

    /**
     * Define the exact date and time to execute the javascript code.
     * @param taskId A unique id for identifying particular task.
     * @param taskType A taskKey associated with headless js component that being registered in the registry.
     * @param millisFromNow Time in milliseconds from now to call the service.
     *
     * @return The execution time for this task in UTC (milliseconds).
     */
    @ReactMethod
    public String bookTask(String taskId, String taskType, Integer millisFromNow) {
        if(mAlarmManager == null){
            return null;
        }

        Task task = createTask(taskId, taskType, millisFromNow);
        Intent taskAlarmIntent = createTaskAlarmIntent(task);
        setAlarm(task.getWakeupTimeMillis(), taskAlarmIntent);
        mTasks.add(task);
        Log.d("TaskScheduler", "Booked " +task.getWakeupTimeMillis().toString());
        return task.getWakeupTimeMillis().toString();
    }

    /**
     * Get incoming tasks which are waiting to be waken up
     * @return an array of Task.
     */
    @ReactMethod
    public ReadableArray getIncomingTasks() {
        WritableArray incomingTasks = new WritableNativeArray();
        WritableMap taskMap = new WritableNativeMap();

        for(Task task: mTasks){
            if(System.currentTimeMillis() < task.getWakeupTimeMillis()) {
                taskMap.putString(Task.BUNDLE_EXTRA_TASK_ID, task.getId());
                taskMap.putString(Task.BUNDLE_EXTRA_TASK_TYPE, task.getType());
                taskMap.putString(Task.BUNDLE_EXTRA_TASK_WAKEUP_AT_MILLIS, task.getWakeupTimeMillis().toString());
                incomingTasks.pushMap(taskMap);
            }
        }

        return incomingTasks;
    }

    private Task createTask(String taskId, String taskType, Integer millisFromNow) {
        Long wakeUpAtMillis = calculateWakeupMillis(millisFromNow);
        return new Task(taskId, taskType, wakeUpAtMillis);
    }

    private Intent createTaskAlarmIntent(Task task) {
        Intent intent = new Intent(context, TaskSchedulerBroadcastReceiver.class);
        Bundle bundle = task.serialize();
        intent.putExtras(bundle);
        return intent;
    }

    private Long calculateWakeupMillis(Integer millisFromNow) {
        return System.currentTimeMillis() + millisFromNow.longValue();
    }

    private void setAlarm(Long wakeupAtMillis, Intent intent){
        PendingIntent alarmIntent = PendingIntent.getBroadcast(context, 0, intent, 0);
        mAlarmManager.setExact(AlarmManager.RTC_WAKEUP, wakeupAtMillis, alarmIntent);
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @NonNull
    @Override
    public String getName() {
        return "TaskScheduler";
    }
}
