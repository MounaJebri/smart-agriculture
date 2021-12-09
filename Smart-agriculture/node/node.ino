//#include <MQ2.h>
//#include <Wire.h> 

/* F
 *  lame Sensor analog example.
Code by Reichenstein7 (thejamerson.com)

For use with a Rain Sensor with an analog out!

To test view the output, point a serial monitor such as Putty at your Arduino. 

  - If the Sensor Board is completely soaked; "case 0" will be activated and " Flood " will be sent to the serial monitor.
  - If the Sensor Board has water droplets on it; "case 1" will be activated and " Rain Warning " will be sent to the serial monitor.
  - If the Sensor Board is dry; "case 2" will be activated and " Not Raining " will be sent to the serial monitor. 

*/

// lowest and highest sensor readings:
const int sensorMin = 0;     // sensor minimum
const int sensorMax = 1024;  // sensor maximum
//MQ2 mq2(A1);

char payload[24] = {}  ; 
int ElectrovanLED = 8;
unsigned long previousMillis = 0;        
const long interval = 20000

;  
void setup() {
  // initialize serial communication @ 9600 baud:
  Serial.begin(9600);  
   // mq2.begin();
     pinMode(ElectrovanLED, OUTPUT);


}
void loop() {
    ReadData() ; 
unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;
RainSensor();
FireSensor() ; 
SolMoistureSensor() ; 
//TemperatureHumiditySensor() ; 
TemperatureHumiditySensorBACKUP() ; // dht11 me yekhdemch 
   VanState(ElectrovanLED) ;
   SendData(payload) ; 
  delay(2000);  // delay between reads*/

        // flashLed(ElectrovanLED, 1, 1000);
//delay (2500) ; 
  }
}
void RainSensor()
{
   // read the sensor on analog A0:
  int sensorReading = analogRead(A0);
    payload[0] = sensorReading >> 8 & 0xff;
    payload[1] = sensorReading & 0xff;
  // map the sensor range (four options):
  // ex: 'long int map(long int, long int, long int, long int, long int)'
  int range = map(sensorReading, sensorMin, sensorMax, 0, 3);
  
  // range value:
  switch (range) {
 case 0:    // Sensor getting wet
    //Serial.println("Flood");
    break;
 case 1:    // Sensor getting wet
   // Serial.println("Rain Warning");
    break;
 case 2:    // Sensor dry - To shut this up delete the " Serial.println("Not Raining"); " below.
   // Serial.println("Not Raining");
    break;
  } 
}
void FireSensor()
{
    int sensorReading = analogRead(A1);
    payload[2] = sensorReading >> 8 & 0xff;
    payload[3] = sensorReading & 0xff;
   
   /*Serial.print("Fire Sensor reading = ") ;
    Serial.println(sensorReading) ; 
   float* values= mq2.read(false); //set it false if you don't want to print the values in the Serial
  int lpg = mq2.readLPG();
      payload[2] = lpg >> 8 & 0xff;
    payload[3] = lpg & 0xff;
  int co = mq2.readCO();
      payload[4] = co >> 8 & 0xff;
    payload[5] = co & 0xff;
  int smoke = mq2.readSmoke();
      payload[6] = smoke >> 8 & 0xff;
    payload[7] = smoke & 0xff;
  Serial.print("LPG:");
  Serial.println(lpg);
  Serial.print(" CO:");
  Serial.println(co);
  Serial.print("SMOKE:");
  Serial.println(smoke);
  Serial.println(" PPM");*/

}
void SolMoistureSensor()
{
      int sensorReading = analogRead(A2);
      
          payload[4] = sensorReading >> 8 & 0xff;
    payload[5] = sensorReading & 0xff;
    /* Serial.print("Moisture  = ") ;
    Serial.println(sensorReading) ; */
  }

 void TemperatureHumiditySensorBACKUP()  // dht11 me yekhdemch 
{
  /* Serial.print("Current humidity = ");
    Serial.print(40.00);
    Serial.print("%  ");
    Serial.print("temperature = ");
    Serial.print(29.75); 
    Serial.println("C  ");*/
    int temp = 29 ;
    int hum = 40 ;
        payload[6] = hum >> 8 & 0xff;
    payload[7] = hum & 0xff;
        payload[8] = temp >> 8 & 0xff;
    payload[9] = temp & 0xff;
  
  }
  void SendData(char* data)
{

       Serial.write(data ,12) ;
      // delay (2500) ; 
        
}
void ReadData()
{
     while (Serial.available()) {
     char inChar = (char)Serial.read(); 
     if (inChar=='4') {
          digitalWrite(ElectrovanLED, HIGH);
          Serial.flush() ; 
      }
        else if (inChar=='5') {
          digitalWrite(ElectrovanLED, LOW);
          Serial.flush();
      }
     }
     }
 void flashLed(int pin, int times, int wait) {

  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(wait);
    digitalWrite(pin, LOW);

    if (i + 1 < times) {
      delay(wait);
    }
  }
}
void VanState(int pin)
{ int state = 5  ;
  int p =  digitalRead(pin);
  if(p==HIGH)
  { state = 4 ;
      payload[10] = state >> 8 & 0xff;
    payload[11] = state & 0xff;}
  else
 { state = 5 ;
     payload[10] = state >> 8 & 0xff;
    payload[11] = state & 0xff;}
  

  
  
  }

  
