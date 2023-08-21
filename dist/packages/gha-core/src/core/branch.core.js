"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBranchBodyMessage = exports.fetchBranch = void 0;
/** @desc branchを取得する */
const fetchBranch = async ({ github, context, branch, ...args // この部分が任意のオブジェクトを受け取るための変更
 }) => await github.rest.repos.getBranch({
    ...context.repo,
    branch,
    ...args,
});
exports.fetchBranch = fetchBranch;
/**
 * @desc ブランチにマージメッセージを反映させる
 * @deprecated 基底ブランチに対しての更新は403で弾かれるため非推奨
 */
const updateBranchBodyMessage = async ({ github, context, branch, body, }) => {
    await github.rest.repos.update({
        ...context.repo,
        base: branch,
        body,
    });
};
exports.updateBranchBodyMessage = updateBranchBodyMessage;
// export const updateBranchBodyMessage2 = async <T extends string>({
//   github,
//   context,
//   branch,
//   body,
// }: GitHubContext & UpdateBranchBodyMessage<T>) => {
//   await github.rest.repos.updateCommitComment({
//     ...context.repo,
//     comment_id: context.sha,
//     body,
//   });
// };
