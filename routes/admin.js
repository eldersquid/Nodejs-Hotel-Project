const express = require('express');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');

router.get('/hospitalList', (req, res) => {
	const title = 'Hospitals';

	res.render('admin/hospital/hospital_list', {
		layout: "admin",
		title: title
	});

});

router.get('/hospitalSearch', (req, res) => {
	const title = "Search Hospital";
	res.render('admin/hospital/hospital_search', {
		layout: "admin",
		title: title
	});
	console.log(req.body.hospital);

});

router.get('/hospitalCreate', (req, res) => {
	const title = "Create Hospital";
	res.render('admin/hospital/hospital_create', {
		layout: "admin",
		title: title
	});


});

router.get('/hospitalCreated', (req, res) => {
	res.render('admin/hospital/hospital_list',
		{ layout: "admin" });


});

router.get('/VehicleList', (req, res) => {
	const title = 'Vehicles';

	res.render('admin/vehicles/vehicle_list', {
		layout: "admin",
		title: title
	});

});

router.get('/vehicleCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/vehicles/vehicle_create', {
		layout: "admin",
		title: title
	});


});

router.get('/vehicleCreated', (req, res) => {
	res.render('admin/vehicles/vehicle_list',
		{ layout: "admin" });


});

router.get('/requestList', (req, res) => {
	const title = 'Requests';

	res.render('admin/requests/request_list', {
		layout: "admin",
		title: title
	});

});

router.get('/requestCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/requests/request_create', {
		layout: "admin",
		title: title
	});


});

router.get('/requestCreated', (req, res) => {
	res.render('admin/requests/request_list',
		{ layout: "admin" });


});

router.get('/galleryList', (req, res) => {
	const title = 'View Gallery';
	res.render('admin/gallery/gallery_list', {
		layout: "admin",
		title: title
	});

});

router.get('/galleryRequests', (req, res) => {
	const title = 'Gallery Requests';
	res.render('admin/gallery/gallery_requests', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesGym', (req, res) => {
	const title = 'Gym Bookings';
	res.render('admin/facilities/facilities_gym', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesSwimming', (req, res) => {
	const title = 'Swimming Pool Bookings';
	res.render('admin/facilities/facilities_swimming', {
		layout: "admin",
		title: title
	});

});

router.get('/ViewReservation', (req, res) => {
	const title = 'View Reservation';
	res.render('admin/reservation/view_reservation', {
		layout: "admin",
		title: title
	});

});

router.get('/ViewReview', (req, res) => {
	const title = 'View Review';
	res.render('admin/reservation/view_review', {
		layout: "admin",
		title: title
	});

});

router.get('/ViewRoomServiceOrders', (req, res) => {
	const title = 'ViewRoomService';
	res.render('admin/reservation/view_orders', {
		layout: "admin",
		title: title
	});

});

module.exports = router;
