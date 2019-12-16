package network.omisego.plasmawallet.schedule;

import android.os.Bundle;

public class Task {
    public static String BUNDLE_EXTRA_TASK_ID = "taskId";
    public static String BUNDLE_EXTRA_TASK_TYPE = "taskType";
    public static String BUNDLE_EXTRA_TASK_WAKEUP_AT_MILLIS = "taskWakeupAtMillis";

    private String id;
    private String type;
    private Long wakeupTimeMillis;

    public Task(String id, String type, Long wakeupTimeMillis) {
        this.id = id;
        this.type = type;
        this.wakeupTimeMillis = wakeupTimeMillis;
    }

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public Long getWakeupTimeMillis() {
        return wakeupTimeMillis;
    }

    public Bundle serialize() {
        Bundle bundle = new Bundle();
        bundle.putString(BUNDLE_EXTRA_TASK_ID, id);
        bundle.putString(BUNDLE_EXTRA_TASK_TYPE, type);
        bundle.putString(BUNDLE_EXTRA_TASK_WAKEUP_AT_MILLIS, wakeupTimeMillis.toString());
        return bundle;
    }

}
