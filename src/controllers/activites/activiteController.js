//ful creation dyal activite 5a nxiki max capacity dyal activite ou la sall li4at dar fuha
const { render } = require('../../core/renderer');
const service = require('../../services/activity/activityService');
const { findById, store, getAllObjects, remove } = require('../../services/globalService');
async function create(req, res) {
    try {
        const associations = await getAllObjects('associations');
        const facilities = await getAllObjects('facilities');
        await render(res, 'activities/create', { associations, facilities });
    } catch (error) {
        console.error("file rendering failed:", error.message);
    }
}
async function index(req, res, params) {
    try {
        const activitiesWithDetails = await service.getAllObjects(
            'activities',
            [
                {
                    table: 'facilities',
                    on: 'facilities.id = activities.facility_id',
                    alias: 'facility_name'
                },
                {
                    table: 'associations',
                    on: 'associations.id = activities.association_id',
                    alias: 'association_name'
                }
            ]
        );

        const now = new Date();
        const filtered = activitiesWithDetails.filter(a => {
            const activityDate = new Date(a.activity_date);
            const [h, m, s] = a.end_time.split(':');
            const endDateTime = new Date(activityDate);
            endDateTime.setHours(h, m, s ?? 0);
            return activityDate >= now || now < endDateTime;
        });
        if (!filtered) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end("no associations created until the moment.");
        }
        await render(res, 'activities/activities', { activitiesWithDetails: filtered });
    } catch (error) {
        console.error("Database query failed:", error.message);
        res.end("Database error: Could not save family group.");
    }
}
async function join(req, res, params) {
    try {
        const activity = await findById('activities', params.id);
        if (!activity) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Activity not found.');
        }
        if (activity.current_participants_number >= activity.max_capacity) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Activity is full.');
        }
        const { updateObject } = require('../../services/globalService');
        await updateObject('activities', params.id, { current_participants_number: activity.current_participants_number + 1 });
        res.writeHead(302, { Location: '/activities' });
        res.end();
    } catch (error) {
        console.error('Failed to join activity:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error.');
    }
}
async function storeActivity(req, res) {
    try {
        let rawBody = '';
        for await (const chunk of req) rawBody += chunk;
        const reqBody = Object.fromEntries(new URLSearchParams(rawBody));
        const facility = await findById('facilities', reqBody.facility_id);
        if (!facility || parseInt(reqBody.max_capacity) > facility.erp_capacity) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end(`Activity max capacity (${reqBody.max_capacity}) exceeds facility capacity (${facility?.erp_capacity}).`);
        }
        await store('activities', reqBody);
        res.writeHead(302, { Location: '/activities' });
        res.end();
    } catch (error) {
        console.error('Failed to create activity:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error: Could not create activity.');
    }
}
async function destroy(req, res, params) {
    try {
        await remove('activities', params.id);
        res.writeHead(302, { Location: '/activities' });
        res.end();
    } catch (error) {
        console.error('Failed to delete activity:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Database error.');
    }
}
module.exports = { index, create, storeActivity, join, destroy };
