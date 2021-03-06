Events = new Mongo.Collection('events');

Events.before.insert(function(userId, doc) {
    doc.dateCreated = new Date();
    if (userId) { //checks if request comes from frontend
        var user = Meteor.user();
        doc.organiser = {
            _id: userId,
            name: user.profile.name
        }
    }
});
if (Meteor.isClient)  {
    AutoForm.hooks({
        'events-new-form': {
            after: {
                insert: function() {
                    Session.set('awaitingCoords', false);
                }
            }
        }
    })
}
Events.attachSchema(new SimpleSchema({
    organiser: {
        type: Object,
        autoform: {
            omit: true
        }
    },
    'organiser._id': {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },
    'organiser.name': {
        type: String,
        autoform: {
            type: 'hidden'
        }
    },
    category: {
        type: Object
    },
    'category._id': {
        type: Number,
        //optional: true,
        autoform: {
            options: function() {
                return Categories.find().map(function(cat) {
                    return {label: cat.name, value: cat._id};
                });
            },
            label: false,
            firstOption: 'Choose event category'
        }
    },
    'category.name': {
        type: String,
        autoform: {
            type: 'hidden'
        },
        optional: true,
        autoValue: function() {
            var categoryId = this.field('category._id').value;
            if (!categoryId) return null;
            return Categories.findOne(categoryId).name;
        }
    },
    'category.color': {
        type: String,
        autoform: {
            type: 'hidden'
        },
        optional: true,
        autoValue: function() {
            var categoryId = this.field('category._id').value;
            if (!categoryId) return null;
            return Categories.findOne(categoryId).color;
        }
    },
    name: {
        type: String,
        label: 'Event name',
        max: 100
    },
    location: {
        type: String,
        label: 'Location',
        max: 100
    },
    meetingPoint: {
        type: String,
        label: 'Meeting point',
        max: 100
    },
    dateEvent: {
        type: Date,
        label: 'Date of the event',
        autoform: {
            type: 'pickadate',
            pickadateOptions: {
                format: 'd mmmm, yyyy',
                formatSubmit: 'yyyy-mm-dd'
            }
        }
    },
    url: {
        type: String,
        label: 'Link',
        optional: true,
        max: 200,
        regEx: SimpleSchema.RegEx.Url
    },
    description: {
        type: String,
        label: 'Description',
        max: 1000
    },
    coordinates: {
        type: Object,
        autoform: {
            //type: "hidden"
        }
    },
    'coordinates.lat': {
        type: Number,
        decimal: true,
        autoform: {
            //disabled: true
            type: "hidden",
            label: false
        }
    },
    'coordinates.lng': {
        type: Number,
        decimal: true,
        autoform: {
            //disabled: true
            type: "hidden",
            label: false
        }
    },
    dateCreated: {
        type: Date,
        label: 'Date published',
        autoform: {
            omit: true
        }
    }
}));
