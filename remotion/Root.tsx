import { Composition, Folder } from 'remotion';
import { BrandHeroLoop, MarketLoop } from './SkyBrandFilms';

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="SkyTheLimit">
        <Composition
          id="HeroCinematic"
          component={BrandHeroLoop}
          durationInFrames={360}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ResidentialLoop"
          component={MarketLoop}
          durationInFrames={180}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{
            market: 'residential',
          }}
        />
        <Composition
          id="CommercialLoop"
          component={MarketLoop}
          durationInFrames={180}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{
            market: 'commercial',
          }}
        />
        <Composition
          id="PublicSectorLoop"
          component={MarketLoop}
          durationInFrames={180}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{
            market: 'public-sector',
          }}
        />
      </Folder>
    </>
  );
};
