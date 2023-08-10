import { fetchPullRequest, fetchPullRequestList, fetchBranch } from 'gha-core/src/core';
import { GitHubContext, TargetPullRequestNumber, RefBranch } from 'gha-core/src/types';
import { FromBranch, BaseBranch } from '../types';

/** -------------------
 * Pull Request
 *  -------------------/

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchPRBodyMessage = async ({
  github,
  context,
  prNumber,
}: GitHubContext & TargetPullRequestNumber): Promise<string | null> => {
  const pr = await fetchPullRequest({
    github,
    context,
    prNumber,
  });
  return pr.data.body;
};

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchPendingPRsBaseTarget = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch) =>
  await fetchPullRequestList({ github, context, base, state: 'open' });

/**
 * @desc target branchにmerge済みのブランチタイトル一覧を取得する
 * @see https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28
 */
export const fetchMergedBasePRsTitle = async ({
  github,
  context,
  base,
}: GitHubContext & BaseBranch): Promise<string[]> => {
  const response = await fetchPullRequestList({
    github,
    context,
    base,
    state: 'closed', // Only closed pull requests
    per_page: 100,
  });

  return response.data.filter((pr) => pr.merged_at).map((pr) => pr.title);
};

/** @desc 自身にmergeされたプルリクエストを取得する */
export const fetchMergedSelfPRs = async ({
  github,
  context,
  prNumber,
}: GitHubContext & TargetPullRequestNumber) => {
  return await fetchPullRequestList({
    github,
    context,
    pull_number: prNumber,
    state: 'closed',
    per_page: 100,
  });
};

/** @desc base ← from: from merged not merge base */
export const fetchPRsMergedInFromNotBase = async ({
  github,
  context,
  base,
  from,
}: GitHubContext & BaseBranch & FromBranch): Promise<string[]> => {
  // developにマージされたがmainにはマージされていないプルリクエストのタイトルを取得
  // これを自身にmergeされたプルリクエストメソッド
  const fromMergedPRs = await fetchPullRequestList({
    github,
    context,
    base: from,
    state: 'closed',
    per_page: 100,
  });

  // baseにmergeされたpull requestを取得する
  const baseMergedPRs = await fetchPullRequestList({
    github,
    context,
    base,
    state: 'closed',
    per_page: 100,
  });

  return fromMergedPRs.data
    .filter(
      (developPR) =>
        developPR.merged_at &&
        !baseMergedPRs.data.some((mainPR) => mainPR.title === developPR.title),
    )
    .map((pr) => pr._links.html.href);
};

/** -------------------
 * Branch
 *  -------------------/

/** @desc Open PRでtargetが指定のbase branchに向いている一覧を取得する */
export const fetchBranchBodyMessage = async <T extends string>({
  github,
  context,
  branch,
}: GitHubContext & RefBranch<T>) => {
  const br = await fetchBranch({
    github,
    context,
    branch,
  });
};