import { Composition } from 'remotion';
import { PainPoint } from './compositions/PainPoint';
import { BeforeAfter } from './compositions/BeforeAfter';
import { HotTake } from './compositions/HotTake';
import { DmResults } from './compositions/DmResults';
import { NobodyCares } from './compositions/NobodyCares';
import { TheMathHurts } from './compositions/TheMathHurts';
import { FiveSeconds } from './compositions/FiveSeconds';
import { DeadWords } from './compositions/DeadWords';
import { BrandIntro } from './compositions/BrandIntro';
import { RepRecruit } from './compositions/RepRecruit';

// 1080x1920 = 9:16 TikTok/Reels/Shorts
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PainPoint"
        component={PainPoint}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BeforeAfter"
        component={BeforeAfter}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HotTake"
        component={HotTake}
        durationInFrames={7 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DmResults"
        component={DmResults}
        durationInFrames={12 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NobodyCares"
        component={NobodyCares}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="TheMathHurts"
        component={TheMathHurts}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="FiveSeconds"
        component={FiveSeconds}
        durationInFrames={12 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DeadWords"
        component={DeadWords}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BrandIntro"
        component={BrandIntro}
        durationInFrames={13 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RepRecruit"
        component={RepRecruit}
        durationInFrames={14 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
