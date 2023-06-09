import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';

const appId = BALANCER_V2_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(appId, network)
export class PolygonBalancerV2BalanceFetcher implements BalanceFetcher {
  constructor(@Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper) {}

  async getPoolBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId,
      groupId: BALANCER_V2_DEFINITION.groups.pool.id,
    });
  }

  async getBalances(address: string) {
    const [poolBalances] = await Promise.all([this.getPoolBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
    ]);
  }
}
