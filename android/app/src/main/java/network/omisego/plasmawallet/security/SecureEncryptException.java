package network.omisego.plasmawallet.security;

public class SecureEncryptException extends Exception {
    public SecureEncryptException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public String getMessage() {
        return super.getMessage() + getCause().getMessage();
    }
}