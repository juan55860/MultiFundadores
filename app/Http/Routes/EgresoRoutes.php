<?php

Route::get('egresos/between/{date1}/{date2}', 'EgresoController@getDeudasBetweenDates');

Route::get('egresos/between/{date1}/{date2}/excel', 'EgresoController@getDeudasBetweenDatesExcel');