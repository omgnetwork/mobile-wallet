package network.omisego.plasmawallet.security;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.*;

public class SecureEncryptModule extends ReactContextBaseJavaModule {
    private SecureEncrypt secureEncrypt;

    public SecureEncryptModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void init(String keyAlias, Promise promise) {
        try {
            this.secureEncrypt = new SecureEncrypt(keyAlias);
            promise.resolve(null);
        } catch(SecureEncryptException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public String encrypt(String msg, Promise promise) {
        String result = null;
        try {
            result = this.secureEncrypt.encrypt(msg);
            promise.resolve(result);
        }catch(SecureEncryptException e) {
            promise.reject(e);
        }
        return result;
    }

    @ReactMethod
    public String decrypt(String encryptedMsg, Promise promise) {
        String result = null;
        try {
            result = this.secureEncrypt.decrypt(encryptedMsg);
            promise.resolve(result);
        } catch(SecureEncryptException e) {
            promise.reject(e);
        }
        return result;
    }

    @NonNull
    @Override
    public String getName() {
        return "SecureEncrypt";
    }
}
