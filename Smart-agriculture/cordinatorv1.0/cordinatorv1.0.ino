/**
 * Copyright (c) 2009 Andrew Rapp. All rights reserved.
 *
 * This file is part of XBee-Arduino.
 *
 * XBee-Arduino is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * XBee-Arduino is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with XBee-Arduino.  If not, see <http://www.gnu.org/licenses/>.
 */

#include <XBee.h>
#include <SoftwareSerial.h>

SoftwareSerial xbees(9,8) ; 
// create the XBee object
XBee xbee = XBee();
uint8_t payload[] = { 0,0,0,0};
uint8_t data[] = {  };
char StartStop = '4';


XBeeAddress64 node = XBeeAddress64(0x0013a200, 0x40ca460e);
XBeeAddress64 Tank = XBeeAddress64(0x0013a200, 0x40c8cc22);

// reception 
XBeeResponse response = XBeeResponse();
// create reusable response objects for responses we expect to handle 
ZBRxResponse rx = ZBRxResponse();
ModemStatusResponse msr = ModemStatusResponse();


void setup() {
//  pinMode(statusLed, OUTPUT);
//  pinMode(errorLed, OUTPUT);
  xbees.begin(9600) ; 
  Serial.begin(1000000);
  xbee.setSerial(xbees);
}

void loop() {   
    ReadData() ; 
   StartStop =  ReadOrder() ;
   
 //StartVan() ; 
 //StopVan(); 
// delay(2500) ; 
  //Serial.print(rx.getRemoteAddress64().getMsb(),HEX);
 //Serial.println(rx.getRemoteAddress64().getLsb(),HEX);
 //Serial.println("hh") ;
 //delay(50) ; 
}
char ReadOrder()
{
     while (Serial.available()) {
     char inChar = (char)Serial.read(); 
     if (inChar=='4') {
        StartVan(inChar) ;        
        Serial.flush() ; 
        return inChar ; 
      }
        else if (inChar=='5') {
        StopVan(inChar) ; 
        Serial.flush();
        return inChar ;
      }
              else if (inChar=='0') {
        WaterTankAuto(inChar) ; 
        Serial.flush();
        return inChar ;
      }
              else if (inChar=='1') {
        WaterTankAuto(inChar) ; 
        Serial.flush();
        return inChar ;
      }
                   else if (inChar=='2') {
        WaterTankAuto(inChar) ; 
        Serial.flush();
        return inChar ;
      }
                   else if (inChar=='3') {
        WaterTankAuto(inChar) ; 
        Serial.flush();
        return inChar ;
      }
      else {
      break ; 
     }
     return StartStop ;
     
     }
      
     }
void StartStopVan(char ss)
{
  payload[0] = ss >> 8  & 0xff ;
  payload[1] = ss & 0xff;

 SendData(node,payload) ;
  }
  void WaterTankAuto(char ss)
{
  payload[0] = ss >> 8  & 0xff ;
  payload[1] = ss & 0xff;

 SendData(Tank,payload) ;
  }
  char StartVan(char ss)
  { 
    StartStopVan(ss) ;
    return ss ;
    }
     char StopVan(char ss)
  { 
    StartStopVan(ss) ;
    return ss ;
    }

void SendData(XBeeAddress64 addr64 ,uint8_t* data )
{
// SH + SL Address of receiving XBee
//XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x40ca460e);
ZBTxRequest zbTx = ZBTxRequest(addr64, data, sizeof(data));
ZBTxStatusResponse txStatus = ZBTxStatusResponse();
  xbee.send(zbTx);

// flash TX indicator
//flashLed(statusLed, 1, 100);
   //Serial.println("sent") ; 
  // after sending a tx request, we expect a status response
  // wait up to half second for the status response
  if (xbee.readPacket(500)) 
    {
    // got a response!
    // should be a znet tx status              
    if (xbee.getResponse().getApiId() == ZB_TX_STATUS_RESPONSE) 
        {
        xbee.getResponse().getZBTxStatusResponse(txStatus);
        // get the delivery status, the fifth byte
        if (txStatus.getDeliveryStatus() == SUCCESS) 
          {
          // success.  time to celebrate
          //flashLed(statusLed, 5, 50);
          //Serial.println("success") ; 
          }
        else 
          {
          // the remote XBee did not receive our packet. is it powered on?
          //flashLed(errorLed, 3, 500);
          //Serial.println("fail") ; 
          }
        }
    } 
  else if (xbee.getResponse().isError()) 
    {
    //Serial.print("Error reading packet.  Error code: ");  
    //Serial.println(xbee.getResponse().getErrorCode());
    
    } 
  else 
    {
    // local XBee did not provide a timely TX Status Response -- should not happen
    //flashLed(errorLed, 2, 50);
    //Serial.println("errar") ; 
    }
}
void ReadData ()
{
xbee.readPacket();
if (xbee.getResponse().isAvailable()) 
  {
  // got something
  if (xbee.getResponse().getApiId() == ZB_RX_RESPONSE) 
    {
    // got a zb rx packet    
    // now fill our zb rx class
    xbee.getResponse().getZBRxResponse(rx);        
    if (rx.getOption() == ZB_PACKET_ACKNOWLEDGED) 
      {
      // the sender got an ACK
      //flashLed(statusLed, 10, 10);
      //Serial.println("sender ack") ; 
      } 
    else 
      {
      // we got it (obviously) but sender didn't get an ACK
      //flashLed(errorLed, 2, 20);
     // Serial.println("sender  not ack") ; 
      }
      if (rx.getRemoteAddress64() == node ) 
      {
    // set dataLed PWM to value of the first byte in the data
    // analogWrite(dataLed, rx.getData(0));
            // this is the payload length, probably
        // what you actually want to use
        //Serial.print("data payload length is ");
        //Serial.println(rx.getDataLength(),DEC);

      uint8_t analogMSB = rx.getData(0);
      uint8_t analogLSB = rx.getData(1);
      int rain = analogLSB + (analogMSB * 256);
   //   Serial.print("rain = ") ;
     // Serial.println(rain) ; 
      uint8_t analogMSB1 = rx.getData(2);
      uint8_t analogLSB1 = rx.getData(3);
      int smoke = analogLSB1 + (analogMSB1 * 256);
      //Serial.print("lpg = ") ; 
    //  Serial.println(smoke) ; 
      /*analogMSB = rx.getData(4);
      analogLSB = rx.getData(5);
       val = analogLSB + (analogMSB * 256);
      Serial.print("co = ") ;
      Serial.println(val) ; 
      analogMSB = rx.getData(6);
      analogLSB = rx.getData(7);
       val = analogLSB + (analogMSB * 256);
      Serial.print("smoke = ") ;
      Serial.println(val) ; */
      analogMSB = rx.getData(4);
      analogLSB = rx.getData(5);
      int moisture = analogLSB + (analogMSB * 256);
      //Serial.print("moist = ") ;
     // Serial.println(moisture) ; 
      analogMSB = rx.getData(6);
      analogLSB = rx.getData(7);
      int humiditiy = analogLSB + (analogMSB * 256);
      //Serial.print("humidity = ") ;
     // Serial.println(humiditiy) ; 
      analogMSB = rx.getData(8);
      analogLSB = rx.getData(9);
      int temperaturee = analogLSB + (analogMSB * 256);
      //Serial.print("temperature = ") ;
     // Serial.println(temperaturee) ;
       analogMSB = rx.getData(10);
      analogLSB = rx.getData(11);
      int van = analogLSB + (analogMSB * 256);
      //Serial.print("van = ") ;
     // Serial.println(van) ;
     String S = 
    /* String (rx.getRemoteAddress64().getMsb(),HEX) + */String (rx.getRemoteAddress64().getLsb(),HEX)+","
     +String (rain) +","
     +String (smoke)+","
     +String (temperaturee)+","
     +String (humiditiy)+","
     +String (moisture)+","
     + String (van)+",";
      Serial.println(S) ; 
      Serial.end() ;
      delay(500) ;  
      Serial.begin(1000000) ; 
    }
     else if (rx.getRemoteAddress64() == Tank ) 
      {
              uint8_t analogMSB = rx.getData(0);
      uint8_t analogLSB = rx.getData(1);
      int rain = analogLSB + (analogMSB * 256);
   //   Serial.print("rain = ") ;
     // Serial.println(rain) ; 
      uint8_t analogMSB1 = rx.getData(2);
      uint8_t analogLSB1 = rx.getData(3);
      int smoke = analogLSB1 + (analogMSB1 * 256);
      //Serial.print("lpg = ") ; 
    //  Serial.println(smoke) ; 
      /*analogMSB = rx.getData(4);
      analogLSB = rx.getData(5);
       val = analogLSB + (analogMSB * 256);
      Serial.print("co = ") ;
      Serial.println(val) ; 
      analogMSB = rx.getData(6);
      analogLSB = rx.getData(7);
       val = analogLSB + (analogMSB * 256);
      Serial.print("smoke = ") ;
      Serial.println(val) ; */
      analogMSB = rx.getData(4);
      analogLSB = rx.getData(5);
      int moisture = 0 ;//analogLSB + (analogMSB * 256);
      //Serial.print("moist = ") ;
     // Serial.println(moisture) ; 
      analogMSB = rx.getData(6);
      analogLSB = rx.getData(7);
      int humiditiy = 0 ;//analogLSB + (analogMSB * 256);
      //Serial.print("humidity = ") ;
     // Serial.println(humiditiy) ; 
      analogMSB = rx.getData(8);
      analogLSB = rx.getData(9);
      int temperaturee = 0 ;//analogLSB + (analogMSB * 256);
      //Serial.print("temperature = ") ;
     // Serial.println(temperaturee) ;
       analogMSB = rx.getData(10);
      analogLSB = rx.getData(11);
      int van = 0 ;//analogLSB + (analogMSB * 256);
      //Serial.print("van = ") ;
     // Serial.println(van) ;
     String S = 
    /* String (rx.getRemoteAddress64().getMsb(),HEX) + */String (rx.getRemoteAddress64().getLsb(),HEX)+","
     +String (rain) +","
     +String (smoke)+","
     +String (temperaturee)+","
     +String (humiditiy)+","
     +String (moisture)+","
     + String (van)+",";
      Serial.println(S) ; 
      Serial.end() ;
      delay(500) ;  
      Serial.begin(1000000) ;
        }
 
  } 
    else if (xbee.getResponse().getApiId() == MODEM_STATUS_RESPONSE) 
      {
      xbee.getResponse().getModemStatusResponse(msr);
      // the local XBee sends this response on certain events, like association/dissociation
      if (msr.getStatus() == ASSOCIATED) 
        {
        // yay this is great.  flash led
        //flashLed(statusLed, 10, 10);
       // Serial.println("associated") ; 
        } 
      else if (msr.getStatus() == DISASSOCIATED) 
        {
        // this is awful.. flash led to show our discontent
        //flashLed(errorLed, 10, 10);
       // Serial.println("dissociated") ; 
      
        } 
      else 
        {
        // another status
//        flashLed(statusLed, 5, 10);
       // Serial.println("other") ; 
        }
      } 
      else 
        {
        // not something we were expecting
        //flashLed(errorLed, 1, 25);   
        Serial.println("error") ; 
        }
  }
else if (xbee.getResponse().isError()) 
  {
  //Serial.print("Error reading packet.  Error code: ");  
  //Serial.println(xbee.getResponse().getErrorCode());
  }
}
