package network.omisego.plasmawallet.schedule;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.facebook.react.HeadlessJsTaskService;

public class TaskSchedulerBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d("TaskScheduler", "Receive");
        HeadlessJsTaskService.acquireWakeLockNow(context);
        Intent service = new Intent(context, TaskSchedulerService.class);
        service.putExtras(intent.getExtras());
        context.startService(service);
    }
}
