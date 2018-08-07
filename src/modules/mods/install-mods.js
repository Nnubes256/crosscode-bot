import Mods from './mods';

class InstallMods extends Mods {

  process() {
    return {
      content : '',
      embed : this.utils.createRichEmbed({
        title: 'Installation guide',
        url: 'https://github.com/CCDirectLink/CCLoader/wiki/Install-mods'
      })
    };
  }
}
