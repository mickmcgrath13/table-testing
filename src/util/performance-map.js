import Map from 'can/map/';
import 'can/map/define/';

export default Map.extend({
  define: {

    // ---- Rendering ---- //
    renderStartTime: {
      value: 0
    },
    renderEndTime: {
      value: 0
    },
    renderTime:{
      get(){
        return (this.attr("renderEndTime") - this.attr("renderStartTime")) || "N/A"
      }
    },


    // ---- Paging ---- //
    lastPageStart:{
      value: 0
    },
    lastPageEnd:{
      value: 0,
      set(v){
        if(v){
          this.attr("lastPageDuration", v - this.attr("lastPageStart"))
        }
        return v;
      }
    },
    lastPageDuration:{
      set(v){
        if(v){
          this.attr("pageDurations").push(v);
        }
        return v;
      }
    },
    pageDurations:{
      value: []
    },
    pageDurationAverage:{
      get(){
        //this will ensure this getter is called when the last page duration changes
        this.attr("lastPageDuration"); 

        var pageDurations = this.attr("pageDurations");
        var avg = 0, 
            total = 0, 
            numDurations = (pageDurations && pageDurations.length) ? pageDurations.length : 0;
        pageDurations && pageDurations.length && pageDurations.forEach(d => {
          total += d;
        });
        if(numDurations > 0){
          avg = total/numDurations;
        }
        return avg || "N/A";
      }
    },

    // ---- Sorting ---- //
    lastSortStart:{
      value: 0
    },
    lastSortEnd:{
      value: 0,
      set(v){
        if(v){
          this.attr("lastSortDuration", v - this.attr("lastSortStart"))
        }
        return v;
      }
    },
    lastSortDuration:{
      set(v){
        if(v){
          this.attr("sortDurations").push(v);
        }
        return v;
      }
    },
    sortDurations:{
      value: []
    },
    sortDurationAverage:{
      get(){
        //this will ensure this getter is called when the last sort duration changes
        this.attr("lastSortDuration"); 

        var sortDurations = this.attr("sortDurations");
        var avg = 0, 
            total = 0, 
            numDurations = (sortDurations && sortDurations.length) ? sortDurations.length : 0;
        sortDurations && sortDurations.length && sortDurations.forEach(d => {
          total += d;
        });
        if(numDurations > 0){
          avg = total/numDurations;
        }
        return avg || "N/A";
      }
    }
  },


  // ---- Rendering ---- //
  setRenderStartTime(){
    this.attr("renderStartTime", this.getTime());
  },
  setRenderEndTime(){
    this.attr("renderEndTime", this.getTime());
  },

  // ---- Paging ---- //
  setLastPageStart(){
    this.attr("lastPageStart", this.getTime());
  },
  setLastPageEnd(){
    this.attr("lastPageEnd", this.getTime());
  },


  // ---- Sorting ---- //
  setLastSortStart(){
    this.attr("lastSortStart", this.getTime());
  },
  setLastSortEnd(){
    this.attr("lastSortEnd", this.getTime());
  },

  // ---- Util ---- //
  getTime(){
    return new Date().getTime();
  }
});