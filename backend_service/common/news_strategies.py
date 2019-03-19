# -*- coding: utf-8 -*-
import moment

def getTimeStrategy(time):
    utcnow = moment.utcnow()
    if time == 'hour': return {'publishedAt': {'$gt': utcnow.subtract(hours=1).date}}
    if time == 'day': return {'publishedAt': {'$gt': utcnow.subtract(days=1).date}}
    if time == 'week': return {'publishedAt': {'$gt': utcnow.subtract(weeks=1).date}}
    if time == 'month': return {'publishedAt': {'$gt': utcnow.subtract(months=1).date}}
    if time == 'year': return {'publishedAt': {'$gt': utcnow.replace(years=utcnow.year-1).date}}
    if time == 'all': return {'publishedAt': {'$gt': moment.utc(1991, 12, 23).date}}


def getPopularityStrategy(p):
    if p == 'new': return '$publishedAt' # 新创建的
    if p == 'best': return '$upvotes' # upvotes数最高的
    if p == 'rising': return '$votes' # votes数最高的
    if p == 'hot': # upvotes数或downvotes数最高的
        return {
            '$cond': {
                'if': {
                    '$gt': ["$upvotes", "$downvotes"],
                },
                'then': '$upvotes',
                'else': '$downvotes'
            }
        }


def getSortStrategy(p):
    if p == 'new': return {'popularity': -1}
    return {
        'popularity': -1,
        'publishedAt': -1
    }


"""
voteStrategies[previous voted, state] => [
    current voted,
    incremental votes,
    incremental downvotes,
    incremental upvotes,
]
"""
voteStrategies = {
    -1: {
        1: [1, 2, -1, 1],
        -1: [0, 1, -1, 0]
    },
    0: {
        1: [1, 1, 0, 1],
        -1: [-1, -1, 1, 0]
    },
    1: {
        1: [0, -1, 0, -1],
        -1: [-1, -2, 1, -1]
    },
}
