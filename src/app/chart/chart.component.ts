import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import Zoom from 'chartjs-plugin-zoom';

Chart.register(...registerables)
Chart.register(Zoom)


@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent{

  isDataLoaded: boolean = false;
  traces: any;
  public chart: any;
  intervalId: any;

  constructor(http: HttpClient, private ngZone: NgZone){
    
    http.get('http://localhost:3000/test').subscribe(response =>{
      this.traces = response
      console.log(this.traces)

      if (this.traces !== undefined) {
        this.refreshChart()
      } else {
        console.log("Traces is coming up as undefined")
      }
      
    });

  }
 

  refreshChart(){
    let i = 0;
    this.intervalId = setInterval(() => {
      this.ngZone.run(() => {
        if(this.chart){
          this.chart.clear();
          this.chart.destroy();
        }
        this.createChart(this.traces[i]);
        i++;
        if(i === this.traces.length){
          i = 0;
        }
      });
    }, 1000); 
  }

  ngOnDestroy(){
    clearInterval(this.intervalId);
  }

  createChart(trace: { trace_id?: number; trace_time: any; trace_data?: any; }) {
    let xValues = Array.from({length: trace.trace_data.length}, (_, i) => i);
    let yValues = trace.trace_data;
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: 'dB',
          data: yValues,
          backgroundColor: 'blue',
          borderWidth: 2,
          pointRadius: 0,
          borderColor: 'blue',
          fill: false
        }]
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: trace.trace_data.length - 1,
            ticks: {
              stepSize: 128
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: trace.trace_time
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
              
            }
          }
        }
      }
    });

  }
  
}
