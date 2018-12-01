/*  assets.js
    ---------
    
    Application assets
    
    Licence
*/
module.exports = function( rs ) {
  'use strict';
  var extend        = rs.RS.extend
  var path          = require( 'path' )
    , www           = { base_directory: path.join( __dirname, 'www' ), debug: true }
    , client_assets = require( 'toubkal/lib/server/client_assets.js' )
  ;
  
  // -------------------------------------------------------------------------------------------
  // Load and Serve Assets
  var toubkal_min = client_assets.toubkal_min() // js/toubkal-min.js
    , map_support = rs.source_map_support_min()
  ;
  
  var amadeus_files = [
        'route.js',
        'application_routes.js',
        'common-widgets.js',
        'navigation.js',
        'home-page.js',
        'signin-page.js',
        'main.js',
        'play.js'
      ]
      
      .map( function( v ) {
        return { path: typeof v === 'string' ? 'js/' + v : v.base_dir + v.filename }
      } )
  ;
  
  var amadeus_min = rs
    .set( amadeus_files, { key: [ 'path' ] } )
    
    .build( 'lib/amadeus-min.js', www )
  ;
  
  return rs
    .Singleton( 'directory_entries', function( source, options ) {
      return source
        .watch_directories( extend._2( { base_directory: __dirname }, options ) )
        
        .filter( ignore )
      ;
      
      function ignore( entry ) {
        return entry.extension.slice( -1 )  != '~' 
            && entry.base.slice( 0, 1 ) != '.'
        ;
      }
    } )
    
    .set( [ { path: '' } ] )
    
    .directory_entries( www )
    
    .filter( [ { type: 'directory' } ] )
    
    .directory_entries()
    
    .filter( [
      { extension: 'json' },
      { extension: 'html' },
      { extension: 'css'  },
      { extension: 'js'   },
      { extension: 'png'  },
      { extension: 'jpg'  },
      { extension: 'jpeg' },
      { extension: 'ttf'  },
      { extension: 'woff' },
      { extension: 'woff2' },
      { extension: 'svg'  },
      { extension: 'mp3'  }
    ] )
    
    .watch( www )
    
    .union( [ toubkal_min, map_support, amadeus_min ] )
  ;
}; // module.export
