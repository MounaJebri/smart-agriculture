/* Water Level Meter

Measuring water level with ultrasonic sensor HR S04.

Arduino IDE 1.5.8
*/

int trig = 12;
int echo = 11;

int trig1 = 6;
int echo1 = 7;
int Van = 5 ; 
int tot = 50 ;
char payload[4] = {}  ; 
unsigned long previousMillis = 0;        
const long interval = 30000 ;
 bool fill= true  ; 
 bool Auto = true ; 

void setup()
{
  Serial.begin(9600);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT); 
    pinMode(trig1, OUTPUT);
  pinMode(echo1, INPUT); 
       pinMode(Van, OUTPUT);
}

void loop()
{
ReadData() ;
ManageTank() ;
unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;
   VanState(Van) ; 
   ReadQuantity(25) ;
   SendData(payload) ;
   //Serial.println("hhhhh") ; 
   delay(1000) ;
  }
 
}
 int ReadQuantity (int tot)
{
  long t = 0 ;   
  long t1 = 0 ; 
  double h = 0 , h1 = 0 ;
  //digitalWrite(Van,HIGH) ;
  // Transmitting pulse
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  
  // Waiting for pulse
  t = pulseIn(echo, HIGH);
  
  // Calculating distance 
  h = t / 58;
 
  //h = h - 6;  // offset correction
 // h = 9.5 - h;  // water height, 0 - 50 cm
  
  
  // Sending to computer
 // Serial.print(h);
  // Serial.print(" cm\n");
 // Serial.print("\n");

   // Transmitting pulse
  digitalWrite(trig1, LOW);
  delayMicroseconds(2);
  digitalWrite(trig1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig1, LOW);
  
  // Waiting for pulse
  t1 = pulseIn(echo1, HIGH);
  
  // Calculating distance 
  h1 = t1 / 58;
 
  //h = h - 6;  // offset correction
 // h = 9.5 - h;  // water height, 0 - 50 cm
  
 double Quantity = ((((h + h1)/2)/tot)*100) ; 
    //Serial.println(100- Quantity) ;
  // Sending to computer
 // Serial.print( h1);
  // Serial.print(" cm\n");
  // Serial.print("\n");
       payload[2] = int (100-(Quantity)) >> 8 & 0xff;
    payload[3] = int (100-(Quantity)) & 0xff ; 
  return  100-Quantity ; 
  }
  void ManageTank()
  {   if(Auto)
  {
      if (ReadQuantity(25)<20)
      fill = true ; 
  else if (ReadQuantity(25)>80)
      fill = false ; 
if (fill) 
      digitalWrite(Van,HIGH) ;
else 
      digitalWrite(Van,LOW) ;

  }


  }
    void SendData(char* data)
{
      Serial.write(data ,4) ;
      // delay (2500) ; 
        
}
void ReadData()
{
     while (Serial.available()) {
     char inChar = (char)Serial.read(); 
   /*  if (inChar=='2') {
          digitalWrite(Van, HIGH);
          Serial.flush() ; 
      }
        else if (inChar=='3') {
          digitalWrite(Van, LOW);
          Serial.flush();
      }*/
             /*else */if (inChar=='0') {
              Auto = false ; 
          digitalWrite(Van, LOW);
          Serial.flush();
      }
                   else if (inChar=='1') {
              Auto = true ; 
          digitalWrite(Van, HIGH);
          Serial.flush();
      }
                         else if (inChar=='2') 
                         {
          digitalWrite(Van, HIGH);
          Serial.flush();
      }
                         else if (inChar=='3')
                         {
          digitalWrite(Van, LOW);
          Serial.flush();
      }
      
     }
     }
     void VanState(int pin)
{ int state = 3  ;
  int p =  digitalRead(pin);
  if(p==HIGH)
  { state = 2 ;
      payload[0] = state >> 8 & 0xff;
    payload[1] = state & 0xff;}
  else
 { state = 3 ;
     payload[0] = state >> 8 & 0xff;
    payload[1] = state & 0xff;}
  

  
  
  }
