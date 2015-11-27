<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class PropietarioLoginRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required|exists:propietarios,id',
            'clave' => 'required'
        ];
    }

    public function response(array $errors)
    {
        return redirect(null,400)->back()->withErrors($errors);
    }
}
