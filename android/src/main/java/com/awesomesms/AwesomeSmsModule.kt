package com.awesomesms

import com.facebook.react.bridge.*
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.database.Cursor
import android.telephony.SmsMessage
import android.util.Log
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.net.Uri
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class AwesomeSmsModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return NAME
    }

    private val receivedMessages: MutableList<WritableMap> = mutableListOf()
    private var smsReceiverRegistered: Boolean = false

    init {
        checkAndRequestPermissions()
    }
    @ReactMethod
    private fun checkAndRequestPermissions() {
        if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS)
            != PackageManager.PERMISSION_GRANTED) {
            if (currentActivity != null) {
                ActivityCompat.requestPermissions(
                    currentActivity!!,
                    arrayOf(Manifest.permission.READ_SMS, Manifest.permission.RECEIVE_SMS),
                    SMS_PERMISSION_REQUEST_CODE
                )
            } else {
                Log.e(NAME, "Current activity is null, cannot request permissions")
            }
        } else {
            retrieveExistingMessages()
            registerSMSReceiver()
        }
    }

    private fun sendEvent(eventName: String, message: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, message)
    }

    private fun retrieveExistingMessages() {
        try {
            val uri = Uri.parse("content://sms/inbox")
            val contentResolver = reactContext.contentResolver
            val cursor: Cursor? = contentResolver.query(uri, null, null, null, null)

            cursor?.use {
                val bodyIndex = it.getColumnIndex("body")
                val addressIndex = it.getColumnIndex("address")
                val dateIndex = it.getColumnIndex("date")

                while (it.moveToNext()) {
                    val messageBody = it.getString(bodyIndex)
                    val senderPhoneNumber = it.getString(addressIndex)
                    val timestamp = it.getLong(dateIndex)

                    val message = Arguments.createMap().apply {
                        putString("messageBody", messageBody)
                        putString("senderPhoneNumber", senderPhoneNumber)
                        putDouble("timestamp", timestamp.toDouble())
                    }
                    receivedMessages.add(message)
                }
            } ?: Log.e(NAME, "Cursor is null")
        } catch (e: Exception) {
            Log.e(NAME, "Error retrieving messages: ${e.message}", e)
        }
    }

    private fun registerSMSReceiver() {
        if (smsReceiverRegistered) return
        val smsReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val extras = intent.extras
                if (extras != null) {
                    val pdus = extras.get("pdus") as Array<*>
                    for (pdu in pdus) {
                        val sms = SmsMessage.createFromPdu(pdu as ByteArray)
                        val messageBody = sms.messageBody
                        val senderPhoneNumber = sms.originatingAddress
                        val timestamp = sms.timestampMillis

                        val params: WritableMap = Arguments.createMap().apply {
                            putString("messageBody", messageBody)
                            putString("senderPhoneNumber", senderPhoneNumber)
                            putDouble("timestamp", timestamp.toDouble())
                        }

                        receivedMessages.add(params)
                        sendEvent("onSMSReceived", params)
                    }
                }
            }
        }

        try {
            val filter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
            reactContext.registerReceiver(smsReceiver, filter)
            smsReceiverRegistered = true
        } catch (e: Exception) {
            Log.e(NAME, "Error registering SMS receiver: ${e.message}", e)
        }
    }

    @ReactMethod
    fun startListeningToSMS() {
        registerSMSReceiver()
    }

    @ReactMethod
    fun getReceivedMessages(promise: Promise) {
        try {
            val messagesArray: WritableArray = Arguments.createArray()
            for (message in receivedMessages) {
                messagesArray.pushMap(message.copy()) // Use a copy of the map
            }
            promise.resolve(messagesArray)
        } catch (e: Exception) {
            Log.e(NAME, "Error getting received messages: ${e.message}", e)
            promise.reject("ERROR", "Error getting received messages: ${e.message}", e)
        }
    }

    companion object {
        const val NAME = "AwesomeSms"
        const val SMS_PERMISSION_REQUEST_CODE = 101
    }
}
