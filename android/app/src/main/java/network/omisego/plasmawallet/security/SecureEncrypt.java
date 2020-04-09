package network.omisego.plasmawallet.security;

/*
 * OmiseGO
 *
 * Created by Phuchit Sirimongkolsathien on 2020-04-08.
 * Copyright © 2019 OmiseGO. All rights reserved.
 */

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.IvParameterSpec;
import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.spec.AlgorithmParameterSpec;

public class SecureEncrypt {

    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String CIPHER_TRANSFORMATION = "RSA/ECB/PKCS1Padding";
    private static final String IV_SEPARATOR = "#";
    private KeyStore keyStore;
    private String keyAlias;
    private Key secretKey;

    private Cipher cipher;

    public void SecureEncrypt(String keyAlias) throws SecureEncryptException {
        this.keyAlias = keyAlias;
        try {
            this.keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            this.keyStore.load(null);
            if (!hasKey(keyAlias)) {
                generateKey();
            }
            this.secretKey = keyStore.getKey(keyAlias, null);
            this.cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        } catch (Throwable cause) {
            throw new SecureEncryptException("Cannot initialize the SecureEncrypt", cause);
        }
    }

    private boolean hasKey(String keyAlias) throws KeyStoreException {
        return keyStore.containsAlias(keyAlias);
    }

    private void generateKey() throws SecureEncryptException {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
            int purposes = KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT;
            KeyGenParameterSpec spec = new KeyGenParameterSpec.Builder(keyAlias, purposes)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setRandomizedEncryptionRequired(true)
                    .build();
            keyGenerator.init(spec);
            keyGenerator.generateKey();
        } catch (Throwable cause) {
            throw new SecureEncryptException("Cannot generate key for the SecureEncrypt", cause);
        }
    }

    public String encrypt(String msg) throws SecureEncryptException {
        try {
            cipher.init(Cipher.ENCRYPT_MODE, this.secretKey);
            byte[] iv = cipher.getIV();
            byte[] encryptedMsg = cipher.doFinal(msg.getBytes());
            String encodedIV = encode(iv);
            String encodedEncryptedMsg = encode(encryptedMsg);
            return encodedIV + IV_SEPARATOR + encodedEncryptedMsg;
        } catch (Throwable cause) {
            throw new SecureEncryptException("Cannot encrypt the msg", cause);
        }
    }

    public String decrypt(String msg) throws SecureEncryptException {
        try {
            String[] parts = msg.split(IV_SEPARATOR);
            String encodedIV = parts[0];
            String encodedEncryptedMsg = parts[1];
            byte[] iv = decode(encodedIV.getBytes());
            byte[] encryptedMsg = decode(encodedEncryptedMsg.getBytes());
            AlgorithmParameterSpec spec = new IvParameterSpec(iv);
            cipher.init(Cipher.DECRYPT_MODE, this.secretKey, spec);
            byte[] originalData = cipher.doFinal(encryptedMsg);
            return new String(originalData);
        } catch (Throwable cause) {
            throw new SecureEncryptException("Cannot decrypt the msg", cause);
        }
    }

    private String encode(byte[] msg) {
        return Base64.encodeToString(msg, Base64.DEFAULT);
    }

    private byte[] decode(byte[] encodedMsg) {
        return Base64.decode(encodedMsg, Base64.DEFAULT);
    }
}
