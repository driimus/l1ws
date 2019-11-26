#!/bin/sh
git rebase -i HEAD~3
GIT_COMMITTER_DATE="Tue 26 Nov 16:20:00 2019 +0000" git ci --amend --no-edit --date "Tue 26 Nov 16:20:00 2019 +0000" --no-verify
git rebase --continue
GIT_COMMITTER_DATE="Tue 26 Nov 16:21:00 2019 +0000" git ci --amend --no-edit --date "Tue 26 Nov 16:21:00 2019 +0000" --no-verify
git rebase --continue
GIT_COMMITTER_DATE="Tue 26 Nov 16:23:00 2019 +0000" git ci --amend --no-edit --date "Tue 26 Nov 16:23:00 2019 +0000" --no-verify
git rebase --continue
