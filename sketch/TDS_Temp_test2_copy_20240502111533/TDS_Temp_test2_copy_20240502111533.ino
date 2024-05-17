// Setup the client to send sensor data to the server
#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <SoftwareSerial.h>
SoftwareSerial mySerial(18,19);// rx tx

#include <LiquidCrystal_I2C.h> 
LiquidCrystal_I2C lcd(0x27,16,2); 
#include <Wire.h>
#include <DHT.h>

#include <USBHID.h>
#include <USBHIDConsumerControl.h>
#include <USBHIDGamepad.h>
#include <USBHIDKeyboard.h>
#include <USBHIDMouse.h>
#include <USBHIDSystemControl.h>
#include <USBHIDVendor.h>
#include <USBVendor.h>

#include <OneWire.h>
#include <DallasTemperature.h>
 
const int oneWireBus = 25; // GPIO where the DS18B20 is connected to
 
#define TdsSensorPin 35
#define VREF 3.3      // analog reference voltage(Volt) of the ADC
#define SCOUNT  3          // sum of sample point 
int analogBuffer[SCOUNT];    // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;
float averageVoltage = 0;
float tdsValue = 0;
float temperature = 0;
 
 
OneWire oneWire(oneWireBus);    // Setup a oneWire instance to communicate with any OneWire devices
 
DallasTemperature sensors(&oneWire);    // Pass our oneWire reference to Dallas Temperature sensor
// Set DHT pin:
#define DHTPIN 36
//dht type of sensor to be used
#define DHTTYPE DHT11   // DHT 11 
// Initialize DHT sensor 
DHT dht = DHT(DHTPIN, DHTTYPE);

float calibration_value = 21.34;
int phval = 0; 
unsigned long int avgval; 
int buffer_arr[10],temp;

/*
const int normal_pH_pin = 2;
const int low_pH_pin = 4;
const int high_pH_pin = 11;
const int normal_conductivity_pin = 5;
const int high_conductivity_pin = 12;
//for dissolved oxygen mapping
const int normal_temperature_pin = 13;
const int high_temperature_pin = 15;*/

//hot and cold water pump control
const int heater_pin = 33;
const int hot_pump_pin = 34;
const int cold_pump_pin = 39;//VN

const int acidic_pump_pin = 14;
const int alkaline_pump_pin = 13;
const int sodiumSulphate_pump_pin = 12;
const int water_pump_pin = 27;

const int heater1_pin = 15;//controlling dissolved oxygen
const int heater2_pin = 2;//generating hot water steam
const int pump1_pin = 4; //circulating hot water
const int pump2_pin = 5; //circulating cold water

const int buzzer_pin = 21;


//float temperature;//to be mapped into dissolved oxygen in the code
float pHValue;
float waterConductivity;
float dissolvedOxygen;

//int high_temp,normal_temp, low_pH, high_pH, normal_pH, high_oxygen,normal_oxygen, normal_conductivity, high_conductivity;

int heater,hot_pump, cold_pump;
//Change the to your wifi credentials
char* ssid = "GalaxyB";
char* password = "12345678";

const char* host = "  192.168.70.111"; // as specified in server.ino
IPAddress staticIP(192, 168, 174, 189);
IPAddress gateway(192, 168, 174, 188);
IPAddress subnet(255, 255, 255, 0);

byte server[] = { 192, 168, 70,111 }; //

// Set up the client objet
WiFiClient client;

WebServer myserver;
 HTTPClient http;

String result = "";
  
void setup()
{
  Serial.begin(115200);
  pinMode(TdsSensorPin, INPUT);
  sensors.begin();
  dht.begin();
  pinMode(heater_pin,INPUT);
  pinMode(hot_pump_pin,INPUT);
  pinMode(cold_pump_pin,INPUT);

    
    pinMode(acidic_pump_pin , OUTPUT);
     pinMode(alkaline_pump_pin , OUTPUT);
     pinMode(sodiumSulphate_pump_pin , OUTPUT);
     pinMode(water_pump_pin , OUTPUT);

      pinMode(heater1_pin , OUTPUT);
     pinMode(pump1_pin , OUTPUT);
     pinMode(heater2_pin , OUTPUT);
     pinMode(pump2_pin , OUTPUT);
     pinMode(buzzer_pin , OUTPUT);

    digitalWrite(acidic_pump_pin, HIGH);
    digitalWrite(alkaline_pump_pin, HIGH);
    digitalWrite(sodiumSulphate_pump_pin, HIGH);
     digitalWrite(water_pump_pin, HIGH);

      digitalWrite(heater1_pin, HIGH);
    digitalWrite(pump1_pin, HIGH);
    digitalWrite(heater2_pin, HIGH);
    digitalWrite(pump2_pin, HIGH);

    digitalWrite(buzzer_pin, LOW);
      

 lcd.init();      // initialize the lcd
  lcd.backlight(); // open the backlight 
    lcd.clear();
   lcd.setCursor(0, 0);  // start to print at the first row
    lcd.print("Condensor Tube");
    lcd.setCursor(0, 1);  // start to print at the first row
    lcd.print("Remote Monitoring");
    Serial.println("Intelligent Condensor Tube Remote Monitoring System");
    delay(1000);
        Serial.println("Start...");//Just show to the monitor that the sketch has started
  WiFi.begin(ssid, password);
  //WiFi.config(staticIP, gateway, subnet);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("IP Address (AP): ");
  Serial.println(WiFi.localIP());
   lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("IP Address:");
  lcd.setCursor(0, 1); 
  lcd.print(WiFi.localIP());

  myserver.on("/", []() {
    myserver.send(200, "text/plain", "Hello World!");
  });
  myserver.begin();
 //   .begin(client);
     delay(1500);

             Serial.println();
     Serial.print("Initiallizing condensor tube remote system"); 
     delay(1000);
}
 
void loop()
{
  heater = digitalRead(heater_pin);
  hot_pump = digitalRead(hot_pump_pin);
  cold_pump = digitalRead(cold_pump_pin);

  if (heater == 0) {
  digitalWrite(heater2_pin, HIGH);//turn off heater
        Serial.println();
				Serial.println("Hot water heater Off");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Hot water");
  lcd.setCursor(0, 1); 
  lcd.print("heater off");
  delay(1000);
  }

    if   (heater == 1) {
  digitalWrite(heater2_pin, LOW);//turn on heater
  //digitalWrite(heater2_pin, LOW);//turn on heater
  //digitalWrite(pump1_pin, LOW);//turn on pump
  //digitalWrite(pump2_pin, LOW);//turn on heater
 
        Serial.println();
				Serial.println("Hot water heater On");
        lcd.clear();  
        lcd.setCursor(0, 0); 
        lcd.print("Hot water");
        lcd.setCursor(0, 1); 
        lcd.print("heater on");
        delay(1000);
  }


  if (hot_pump == 0) {
  digitalWrite(pump1_pin, HIGH);//turn off hot water pump
        Serial.println();
				Serial.println("Hot water pump Off");
        lcd.clear();  
        lcd.setCursor(0, 0); 
        lcd.print("Hot water");
        lcd.setCursor(0, 1); 
        lcd.print("pump off");
        delay(1000);
  }

  if (hot_pump == 1) {
  digitalWrite(pump1_pin, LOW);//turn on hot water pump
    Serial.println();
    Serial.println("Hot water pump On");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Hot water");
    lcd.setCursor(0, 1); 
    lcd.print("pump on");
    delay(1000); 
  }


  if (cold_pump == 0) {
  digitalWrite(pump2_pin, HIGH);//turn off cold water pump
    Serial.println();
    Serial.println("Cold water pump Off");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Cold water");
    lcd.setCursor(0, 1); 
    lcd.print("pump off");
    delay(1000);
  }

  if (cold_pump == 1) {
  digitalWrite(pump2_pin, LOW);//turn on cold water pump
      Serial.println();
      Serial.println("Cold water pump On");
      lcd.clear();  
      lcd.setCursor(0, 0); 
      lcd.print("Cold water");
      lcd.setCursor(0, 1); 
      lcd.print("pump on");
      delay(1000);
  }  


  pHValue = getpH();

  Serial.println();
  Serial.print("PH Value:");
  Serial.print(pHValue);
  // Serial.print(" ");
  lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("PH Value:");
  lcd.setCursor(0, 1); 
  lcd.print(pHValue);
  delay(1000);


  
  if(pHValue >= 6 && pHValue <=9) {
 digitalWrite(acidic_pump_pin, HIGH);//turn off acidic dosing pump
  digitalWrite(alkaline_pump_pin, HIGH);//turn off alkaline dosing pump
  digitalWrite(buzzer_pin, LOW);//turn off buzzer
        Serial.println();
				Serial.println("PH Value Normal");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("PH Value");
  lcd.setCursor(0, 1); 
  lcd.print("Normal");
  delay(1000);

 	         }


   if(pHValue > 9) {
 digitalWrite(acidic_pump_pin, LOW);//turn on acidic dosing pump
  digitalWrite(alkaline_pump_pin, HIGH);//turn off alkaline dosing pump
  digitalWrite(buzzer_pin, HIGH);//turn on buzzer
        Serial.println();
				Serial.println("PH Value High, Acidic Dosing Pump On");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("PH High");
  lcd.setCursor(0, 1); 
  lcd.print("Acid Pump On");
  delay(1000);
  sendSmss();

 	         }


    if(pHValue < 6) {
 digitalWrite(acidic_pump_pin, HIGH);//turn off acidic dosing pump
  digitalWrite(alkaline_pump_pin, LOW);//turn on alkaline dosing pump
   digitalWrite(buzzer_pin, HIGH);//turn on buzzer
        Serial.println();
				Serial.println("PH Value Low, Alkaline Dosing Pump On");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("PH High");
  lcd.setCursor(0, 1); 
  lcd.print("Alkali Pump On");
  delay(1000);
  sendSms();

 	         }  
  
  sensors.requestTemperatures();
  float temperature = sensors.getTempCByIndex(0);
 
  static unsigned long analogSampleTimepoint = millis();
  if (millis() - analogSampleTimepoint > 40U)  //every 40 milliseconds,read the analog value from the ADC
  {
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);    //read the analog value and store into the buffer
    analogBufferIndex++;
    if (analogBufferIndex == SCOUNT)
      analogBufferIndex = 0;
  }
  static unsigned long printTimepoint = millis();
  if (millis() - printTimepoint > 800U)
  {
    printTimepoint = millis();
    for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++)
      analogBufferTemp[copyIndex] = analogBuffer[copyIndex];
    averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 1024.0; // read the analog value more stable by the median filtering algorithm, and convert to voltage value
    float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0); //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
    float compensationVolatge = averageVoltage / compensationCoefficient; //temperature compensation
    tdsValue = (133.42 * compensationVolatge * compensationVolatge * compensationVolatge - 255.86 * compensationVolatge * compensationVolatge + 857.39 * compensationVolatge) * 0.5; //convert voltage value to tds value
 
    Serial.print("TDS Value:");
    Serial.print(tdsValue, 0);
    Serial.println("ppm");

    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("TDS Value:");
    lcd.setCursor(0, 1); 
    lcd.print(tdsValue, 0);
    delay(1000);
 
    Serial.print("Temperature:");
    Serial.print(temperature);
    Serial.println("ºC");

    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Temperature:");
    lcd.setCursor(0, 1); 
    lcd.print(temperature);
    delay(500);
  }
    
    waterConductivity = tdsValue;
     Serial.println();
   Serial.print("Water Conductivity:");
    Serial.print(waterConductivity);
    // Serial.print(" ");
      lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Conductivity:");
  lcd.setCursor(0, 1); 
  lcd.print(waterConductivity);
  delay(1000);


     if(waterConductivity > 10000) {
  digitalWrite(water_pump_pin, LOW);//turn on water pump
   digitalWrite(buzzer_pin, HIGH);//turn on buzzer
        Serial.println();
				Serial.println("Water Conductivity High, Water Pump On");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Conductivity High");
  lcd.setCursor(0, 1); 
  lcd.print("Water Pump On");
  delay(1000);
  sendSmsss();

 	         }


  if(waterConductivity <= 10000) {
  digitalWrite(water_pump_pin, HIGH);//turn off water pump
   digitalWrite(buzzer_pin, LOW);//turn off buzzer
        Serial.println();
				Serial.println("Water Conductivity Normal, Water Pump Off");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Conductivity Normal");
  lcd.setCursor(0, 1); 
  lcd.print("Water Pump Off");
  delay(1000);

 	         }

   /*

  if (normal_oxygen== 1 && high_oxygen == 0) {

  dissolvedOxygen = random(7,10);
  }

  else if (normal_oxygen== 0 && high_oxygen == 1) {

  dissolvedOxygen = random(11,14);
  }

  //exit testing mode and get the reading from temperature sensor mapping

  else {
  //To be further calibrated, override temperature value with dissolved oxygen and send as dissolved oxygen
  dissolvedOxygen = getTemperature(); //which will be mapped to our dissolved oxygen without changing its name

  }*/

  dissolvedOxygen = temperature; //conversion mapping formula, can be changed;
   Serial.println();
   Serial.print("Dissolved Oxygen:");
    Serial.print(dissolvedOxygen);
    // Serial.print(" ");
      lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Dissolved Oxygen:");
  lcd.setCursor(0, 1); 
  lcd.print(dissolvedOxygen);
  delay(1000);

    //high temperature, low dissolved oxygen
   if(temperature >= 38) {
  digitalWrite(sodiumSulphate_pump_pin, HIGH);//turn off sodium sulphate pump
  digitalWrite(heater1_pin, HIGH);// heater off
   digitalWrite(buzzer_pin, LOW);//turn off buzzer
        Serial.println();
				Serial.println("Dissolved Oxygen Low, Sodium Sulphate Pump & Water Heater Off");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Oxygen Low");
  lcd.setCursor(0, 1); 
  lcd.print("Heater & Na2S04 Pump Off");
  delay(1000);

 	         }

  //low temperature, high dissolved oxygen
  if(temperature < 34) {
  digitalWrite(sodiumSulphate_pump_pin, LOW);//turn on sodium sulphate pump to increase temperature
  digitalWrite(heater1_pin, LOW);//or heat to raise temperature
   digitalWrite(buzzer_pin, HIGH);//turn on buzzer
        Serial.println();
				Serial.println("Dissolved Oxygen High, Sodium Sulphate Pump & Water Heater On");
         lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Oxygen High");
  lcd.setCursor(0, 1); 
  lcd.print("Heater & Na2S04 Pump On");
  delay(1000);


    sendSmssss();

 	         }
  //httpRequest(pHValue,waterConductivity , dissolvedOxygen);
  Serial.println("httpRequest:");
  if (client.connect(server, 80)) {
    Serial.println("connected:");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Connected");
    String url = "/RemoteMonitoring/sensor_reading.php?pHValue=" + String(pHValue) + "&waterConductivity=" + String(waterConductivity)+ "&dissolvedOxygen=" + String(dissolvedOxygen);
    Serial.println(url);
    // Serial.println(url);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host +  "\r\n" +
                 "Connection: keep-alive\r\n\r\n"); // minimum set of required URL headers

    delay(10);
    // Read all the lines of the response and print them to Serial
    Serial.println("Response: ");
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
    if (!client.connected()) {
      Serial.println();
      Serial.println("disconnecting.");
      lcd.clear();  
      lcd.setCursor(0, 0); 
      lcd.print("Disconnecting");
      client.flush();
      client.stop();
       //http.end();
    }
  }
  else {
    //if you didn't get a connection to the server:
    Serial.println("connection failed");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Connection Failed");
  }
  
  delay(500);
} // end of void main 
  

  int getMedianNum(int bArray[], int iFilterLen)
  {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++)
  {
    for (i = 0; i < iFilterLen - j - 1; i++)
    {
      if (bTab[i] > bTab[i + 1])
      {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0)
    bTemp = bTab[(iFilterLen - 1) / 2];
  else
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  return bTemp;
  }

  //PH Function
  float getpH() {
 for(int i=0;i<10;i++) 
 { 
 buffer_arr[i]=analogRead(32);
 delay(30);
 }
 for(int i=0;i<9;i++)
 {
 for(int j=i+1;j<10;j++)
 {
 if(buffer_arr[i]>buffer_arr[j])
 {
 temp=buffer_arr[i];
 buffer_arr[i]=buffer_arr[j];
 buffer_arr[j]=temp;
 }
 }
 }
 avgval=0;
 for(int i=2;i<8;i++)
 avgval+=buffer_arr[i];
 float volt=(float)avgval*5.0/1024/6;
 float ph_act = -5.70 * volt + calibration_value;
 pHValue = ph_act;
 lcd.setCursor(0, 0);
 lcd.print("pH Val:");
 lcd.setCursor(8, 0);
 lcd.print(ph_act);
 delay(500);
 return pHValue;
}


/*float getTemperature(){

  temperature = dht.readTemperature();

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" \xC2\xB0");
  Serial.print("C");
 
   lcd.clear();  
  lcd.setCursor(0, 0);  
  lcd.print("Temperature:");
  lcd.setCursor(0, 1); 
  lcd.print(temperature);
  lcd.setCursor(4, 1); 
  lcd.print(" \xC2\xB0");
  lcd.setCursor(5, 1); 
  lcd.print("C");
  delay(1000);
  dissolvedOxygen = temperature/2; //calibration conversion formula to be further revised

  return dissolvedOxygen;
}

float getConductivity()  {
//to be further calibrated depending on the actual sensor to be used
waterConductivity = analogRead(33);
return waterConductivity;  
}*/

/* //Temporary comment of httpRequest function to check behaviour by implementing directly in void loop
String httpRequest(float pHValue, float waterConductivity, float dissolvedOxygen) {
  Serial.println("httpRequest:");
  if (client.connect(server, 80)) {
    Serial.println("connected:");
      lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Connected");
     String url = "/RemoteMonitoring/sensor_reading.php?pHValue=" + String(pHValue) + "&waterConductivity=" + String(waterConductivity)+ "&dissolvedOxygen=" + String(dissolvedOxygen);
  Serial.println(url);
   // Serial.println(url);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host +  "\r\n" +
                 "Connection: keep-alive\r\n\r\n"); // minimum set of required URL headers

    delay(10);
    // Read all the lines of the response and print them to Serial
    Serial.println("Response: ");
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
    if (!client.connected()) {
      Serial.println();
      Serial.println("disconnecting.");
        lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Disconnecting");
      client.flush();
      client.stop();
       //http.end();
    }
  }
  else {
    //if you didn't get a connection to the server:
    Serial.println("connection failed");
        lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Connection Failed");
  }
  

}*/



//GSM ABNORMAL SENSOR DATA NOTIFICATION FUNCTIONS
void sendSms()
{
   lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Sending Message...");
  Serial.println("Initializing...");
  delay(1000);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
 mySerial.println("AT+CMGS=\"+263771496385\"");
   delay(500);
  updateSerial();
  mySerial.print("PH Value Low, Alkaline Dosing Pump On");
  updateSerial();
  mySerial.write(26); 
  
}


void sendSmss()
{
   lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Sending Message...");
  Serial.println("Initializing...");
  delay(500);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
 mySerial.println("AT+CMGS=\"+263771496385\"");
   delay(500);
  updateSerial();
  mySerial.print("PH Value High, Acidic Dosing Pump On");
  updateSerial();
  mySerial.write(26); 
  
}

void sendSmsss()
{
   lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Sending Message...");
  Serial.println("Initializing...");
  delay(500);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
 mySerial.println("AT+CMGS=\"+263771496385\"");
   delay(500);
  updateSerial();
  mySerial.print("Water Conductivity High, Water Pump On");
  updateSerial();
  mySerial.write(26); 
  
}

void sendSmssss()
{
   lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("Sending Message...");
  Serial.println("Initializing...");
  delay(500);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
 mySerial.println("AT+CMGS=\"+263771496385\"");
   delay(500);
  updateSerial();
  mySerial.print("Dissolved Oxygen High, Heater & Sodium Sulphate Pump On");
  updateSerial();
  mySerial.write(26); 
  
}

void updateSerial()
{

  delay(500);  
  while(Serial.available())
  {
    mySerial.write(Serial.read());
  }
  while(mySerial.available())
  {
    Serial.write(mySerial.read());
  }
  }
