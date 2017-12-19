export default {
  format: 'umd',
  moduleName: 'ngresizable',
  external: [
    '@angular/core',
    '@angular/common'
  ],
  onwarn: ( warning ) => {
      const skip_codes = [
          'THIS_IS_UNDEFINED',
          'UNRESOLVED_IMPORT',
          'MISSING_GLOBAL_NAME'
      ];
      if ( skip_codes.indexOf(warning.code) != -1 ) return;
      console.error(warning);
  }
};

