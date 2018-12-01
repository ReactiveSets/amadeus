module.exports =
function( rs ) {
  rs.Compose( 'amadeus_beats', function( source, beat, options ) {
    var id       = -1
      , sequence = -1
    ;
    
    return source
      
      .beat( beat )
      
      .alter( function( _ ) {
        delete _.interval;
        
        _.flow = 'amadeus_beats';
        
        _.id = ++id;
        
        _.sequence = sequence = ( sequence + 1 ) % 10;
      } )
      
      //.trace( options.name ).greedy()
    ;
  } )
}
